---
title: "You Probably Don't Need a Queue or Cache Yet"
description: "When starting a new project, it's tempting to introduce Redis, RabbitMQ, SQS, or other infrastructure as soon as you need caching or background jobs. But if PostgreSQL is already your source of truth, you may not need them yet"
date: 2026-09-22
tags: ['PostgreSQL', 'Async Jobs', 'Caching', 'Infra']
draft: false
---



## You Probably Don't Need a Queue or Cache Yet

If you're not serving static files, the first piece of infra your application needs is probably a database. After shipping a couple of features, you'll be considering adding a Redis instance for handling caching and async jobs and queues for async processing. I see this very often in early-staged projects, specially at the AI-era, when we can build things very quickly.

Now your project architecture has 3-5 infra components before the product release and have a meaningful amount of users or traffic. More infra means costs, manageability and complexity. If you are using PostgreSQL, you can use your own database to address these requirements before you need something more robust. In this paper I show you how.



## Caching with Postgres

Most of my bugs over the years reduce to one thing: a boundary that accepted data it should
have rejected. So validation lands at the edge, before anything downstream can believe it.

```ts
import Fastify from 'fastify'

const app = Fastify({ logger: true })

app.post('/plans', {
  schema: {
    body: {
      type: 'object',
      required: ['patientId', 'amountCents', 'months'],
      properties: {
        patientId: { type: 'string', format: 'uuid' },
        amountCents: { type: 'integer', minimum: 1 },
        months: { type: 'integer', minimum: 1, maximum: 60 },
      },
    },
  },
  handler: async (request, reply) => {
    // By here the payload is already the shape the rest of the system assumes.
    return reply.code(201).send({ status: 'created' })
  },
})

await app.listen({ port: 3000 })
```

Nothing clever. That is the point — the interesting decisions should be visible in the
architecture, not hidden in a handler quietly coercing a string into a number.

## Cadence

No schedule. I would rather publish six posts a year that were worth the read than
twenty that were not. If you want them as they land, there is an
[RSS feed](/rss.xml).
