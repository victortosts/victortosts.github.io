---
title: "PostgreSQL is enough; Until it isn't"
description: "When starting a new project, it's tempting to introduce Redis, RabbitMQ, SQS, or other infrastructure as soon as you need caching or background jobs. But if PostgreSQL is already your source of truth, you may not need them yet"
date: 2026-09-22
tags: ['PostgreSQL', 'Async Jobs', 'Queue', 'Caching', 'Infra']
draft: false
---


If you're not serving static content, the first piece of infrastructure you need is probably a database. After shipping a few features, you may start considering Redis for caching, a queue for background jobs, or other infrastructure to handle asynchronous processing. I see this happen frequently in early-stage projects, especially in the AI era, when we can build and ship products faster than ever.

Now your project architecture has 3-5 infra components before the product has even launched or accumulated meaningful traffic. More infra means costs, operational overhead and complexity. If you're already using PostgreSQL, you may be able to use it for some of these workloads before introducing specialized infrastructure. In this article, I'll show you how and where this starts to break down.




## PostgreSQL as an async work queue

Usually, working with queues and asynchronous processors means that you need to satisfy two fundamental requirements:

- Manage the lifecycle of work: persist jobs, track their state, and handle failures and retries.
- Process jobs concurrently: allow multiple workers to consume jobs in parallel without claiming the same job at the same time.

The first requirement is something a database is naturally good at. Persisting data, tracking state, and making state transitions atomic are problems databases are designed to solve.

The second one is more interesting. Once multiple workers are consuming jobs from the same pool, we need a way to safely claim a job without another worker claiming it at the same time. This is a concurrency problem, and PostgreSQL already provides a mechanism for it: `FOR UPDATE SKIP LOCKED`.

You can easily model a simple queue in your PostgreSQL database, starting by creating a jobs table:

```sql
CREATE TYPE job_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed'
);

CREATE TABLE jobs (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status job_status NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
```

Insert new jobs into the queue with an INSERT statement:

```sql
INSERT INTO jobs (type, payload)
VALUES (
  'send_email',
  '{"to": "user@example.com"}'
);
```

Now comes the interesting part, **claiming a job**. In a real application, there will usually be multiple workers pulling jobs from the same pool. The workers are all trying to claim the next available job, so this needs to be an atomic operation. We don't want to first select a pending job and then update it separately, because another worker could select the same job in between.

![Workers polling a jobs table in PostgreSQL, each claiming its own batch of rows](/images/postgres-job-workers.svg)
*Three workers, one jobs table. No broker in the middle.*

We don't want to first select a pending job and then update it in a separate operation, because another worker could select the same job in between. The idea is to select an available job, lock it so another worker cannot claim it at the same time, and change its state to processing as part of the same operation.

```sql
WITH job AS (
  SELECT id
  FROM jobs
  WHERE status = 'pending'
  ORDER BY created_at
  LIMIT 1
  FOR UPDATE SKIP LOCKED
)
UPDATE jobs
SET
  status = 'processing',
  attempts = attempts + 1,
  started_at = NOW()
FROM job
WHERE jobs.id = job.id
RETURNING jobs.*;
```

`FOR UPDATE` prevents two concurrent transactions from acquiring the same job row for processing at the same time. When **Worker 1** selects a job with `FOR UPDATE`, PostgreSQL locks that row for the duration of the transaction. If **Worker 2** tries to claim the same row, it cannot acquire the lock while **Worker 1** is holding it.

But this introduces another problem. **Worker 2** doesn't necessarily want to wait for **Worker 1** to finish. There may be plenty of other pending jobs available for it to process.

This is where SKIP LOCKED comes in.

- `FOR UPDATE` → locks the selected row so another worker cannot claim it.
- `SKIP LOCKED` → skips rows that are already locked instead of waiting for them.

After processing, complete the job with:

```sql
UPDATE jobs
SET
  status = 'completed',
  completed_at = NOW()
WHERE id = $1;
```

Or handle failures:
```sql
UPDATE jobs
SET
  status = 'failed'
WHERE id = $1;
```

If you need to retry a failed job, just return its state for pending status:

```sql
UPDATE jobs
SET
  status = 'pending'
WHERE id = $1;
```

### When it starts to break down

As this article proposes, this approach is mainly intended for early-stage projects where you already have PostgreSQL and want to avoid adding new infrastructure before the product is validated and real usage justifies it. As the project grows, however, this approach comes with some limitations:

- **Horizontal scaling can put pressure on the database**. Every worker needs a database connection to poll for and claim jobs. As you add more workers, you also increase connections, queries, and lock contention. At some point, the database becomes the bottleneck, and adding more workers won't improve throughput.

- **Queue throughput is tied to database throughput**. Since PostgreSQL is both the source of truth and the queue, the queue's throughput is constrained by what the database can handle. At some point, separating the queue from the database allows each system to scale and perform independently.

- **Queue workloads can affect application queries**. As the application grows, PostgreSQL may be handling regular application queries alongside queue polling and job updates. Eventually, the additional workload from the queue can compete for the same database resources and start affecting application query performance.

## Caching with Postgres

Another common requirement is caching data that is frequently requested but expensive to compute. The usual approach is to store the result in a dedicated cache, such as Redis, using a unique key and an expiration or invalidation strategy.

At first, using the database as a cache might sound contradictory. The whole point of a cache is to avoid hitting the database in the first place. But if PostgreSQL is already part of your infrastructure, there are cases where using it as a cache can still make sense. The idea is simple: we can use a separate table to store expensive-to-compute data in the format the application needs, avoiding expensive queries and transformations on every request. PostgreSQL provides a feature that is particularly interesting for this use case: `UNLOGGED` tables.

These tables have one important difference from regular tables: their changes are not written to the write-ahead log (WAL). Consequently, write operations have less overhead and can require less I/O. The trade-off is durability. If PostgreSQL crashes or shuts down unexpectedly, an unlogged table may be automatically truncated.

That's exactly what we want for cache data. The original data still exists in the regular tables, so if the cache is lost, the application can simply rebuild it.

OK, show me the code:

```sql
CREATE UNLOGGED TABLE cache (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
);
```

Notice that we can use a `JSONB` column instead of storing individual fields and reconstructing the response. This allows us to store the data already prepared in the format the application needs.

Populate the cache with an `INSERT`:

```sql
INSERT INTO cache (key, data, expires_at)
VALUES (
  $1,
  '{
    "foo": "bar",
    "baz": "fulano"
  }',
  NOW() + INTERVAL '1 hour'
);
```

In a real application, the data value would usually be generated from the expensive query that we want to avoid running on every request.

Then you can fetch it with a simple lookup:

```sql
SELECT data
FROM cache
WHERE key = $1
  AND expires_at > NOW();
```

There are a few simple ways to manage the cache. If the underlying data changes, we can update the cached value directly, invalidate it by updating its expiration, or delete the entry entirely.

```sql
-- Update the cached value
UPDATE cache
SET
  data = '{
    "baz": "foo",
    "fulano": "bar"
  }',
  expires_at = NOW() + INTERVAL '1 hour'
WHERE key = $1;

-- Invalidate by expiration
UPDATE cache
SET expires_at = NOW()
WHERE key = $1;

-- Or delete the cached value
DELETE FROM cache
WHERE key = $1;
```

### When it starts to break down

As with the queue approach, this caching strategy is mainly intended for early-stage projects where PostgreSQL is already part of the infrastructure and adding another service isn't justified yet.

As the project grows, however, there are some limitations:

- **Cache traffic can affect application queries.** Since the cache uses the same PostgreSQL instance as the application's main data, cache reads and writes compete for the same database resources. At some point, the additional workload can start affecting the performance of regular application queries.

- **The cache may need to scale independently.** As cache traffic grows, you may want to scale the cache separately from the database. With PostgreSQL, both workloads share the same infrastructure, while a dedicated cache can scale independently.

- **Cache management can become more complex.** Simple expiration and invalidation may be enough initially, but more advanced requirements such as eviction policies, distributed caching, or more sophisticated invalidation strategies can make a dedicated caching system more appropriate.

## References

- [PostgreSQL Feature Matrix — SKIP LOCKED clause](https://www.postgresql.org/about/featurematrix/detail/skip-locked-clause/)
- [Neon — Building a Queue System with PostgreSQL](https://neon.com/guides/queue-system)
- [PostgreSQL Feature Matrix — UNLOGGED tables](https://www.postgresql.org/about/featurematrix/detail/unlogged-tables/)
- [PostgreSQL — UNLOGGED Tables](https://medium.com/postgresql-blogs/unlogged-tables-in-postgres-02aed2c747d7)