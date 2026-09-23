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

### Important Considerations:

As this article proposes, this approach is mainly intended for early-stage projects where you already have PostgreSQL and want to avoid adding new infrastructure before the product is validated and real usage justifies it. As the project grows, however, this approach comes with some limitations:

- **Horizontal scaling can put pressure on the database**. Every worker needs a database connection to poll for and claim jobs. As you add more workers, you also increase connections, queries, and lock contention. At some point, the database becomes the bottleneck, and adding more workers won't improve throughput.

- **Queue throughput is tied to database throughput**. Since PostgreSQL is both the source of truth and the queue, the queue's throughput is constrained by what the database can handle. At some point, separating the queue from the database allows each system to scale and perform independently.

- **Queue workloads can affect application queries**. As the application grows, PostgreSQL may be handling regular application queries alongside queue polling and job updates. Eventually, the additional workload from the queue can compete for the same database resources and start affecting application query performance.

## Caching with Postgres

... To be Written... In Progress

## References

- [PostgreSQL Feature Matrix — SKIP LOCKED clause](https://www.postgresql.org/about/featurematrix/detail/skip-locked-clause/)
- [Neon — Building a Queue System with PostgreSQL](https://neon.com/guides/queue-system)