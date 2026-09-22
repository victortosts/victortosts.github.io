---
title: 'Why I finally built a page of my own'
description: 'Ten years of backends, none of it written down anywhere I control. Starting here.'
date: 2026-09-22
tags: ['meta', 'backend']
draft: false
---

I have been writing backends for about a decade and have almost nothing to show for it
outside of a resume and some private repositories. Every system I am proud of lives behind
a company VPN. This page is the fix: a place I own, where the interesting parts of the work
can exist in public.

## What I plan to write about

Mostly the unglamorous middle of backend engineering — the part between "it works on my
machine" and "it survived Black Friday":

- Event-driven systems that stay debuggable: queues, topics, retries, and the dead letters
  nobody reads until it is too late.
- Multi-channel messaging at volume — what actually breaks when email, SMS, WhatsApp and
  chat all share one delivery pipeline.
- Node.js and TypeScript in production: Fastify, schema validation at the edge, and why
  I keep reaching for boring types.
- Observability as a design constraint rather than an afterthought.

## A small example

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
