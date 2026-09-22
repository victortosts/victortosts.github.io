/**
 * Single source of truth for every fact rendered on the site.
 * Components read from here; nothing hardcodes CV content in markup.
 */

export const profile = {
  name: 'Victor Tostes',
  handle: 'victor',
  host: 'portfolio',
  role: 'Senior Backend & Full-Stack Engineer',
  location: 'Belo Horizonte, Brazil (UTC−3)',
  tagline: 'Node.js and TypeScript, mostly. Event-driven systems, microservices, and the observability to keep them honest.',
  description:
    'Victor Tostes — Senior backend and full-stack engineer. Node.js, TypeScript, microservices, event-driven systems on AWS.',
} as const

/**
 * The blog is written and working, but unpublished until there is something to
 * read. To bring it back: flip `blog` to true and drop the `_` prefix from
 * `src/pages/_blog/` and `src/pages/_rss.xml.ts`.
 */
export const features = { blog: false } as const

export const links = {
  github: 'https://github.com/victortosts',
  linkedin: 'https://linkedin.com/in/victorltb',
  resume: '/resume/victor-tostes-resume.pdf',
  blog: '/blog',
  rss: '/rss.xml',
} as const

export const about = [
  'I\u2019m a builder. What I enjoy most is taking something from a rough idea to a system people rely on: the services and queues underneath, the interface on top, and the many small judgement calls in between about what to keep simple and what to leave room for. Most of what I know came from <span class="hl">10+ years</span> of shipping software that had to keep working at volume, with real money and real deadlines attached.',
] as const

export type CareerEntry = {
  hash: string
  date: string
  kind: string
  message: string
  /** Marks the current position; rendered as (HEAD). */
  head?: boolean
}

/**
 * The hero cycles through these: each command types itself out, prints a one-line
 * answer, holds, then erases. Keep answers to a single line at desktop width.
 */
export const heroCommands = [
  {
    cmd: 'whoami --verbose',
    out: 'Senior backend engineer \u2014 Node.js and TypeScript, ~10 years in production.',
  },
  {
    cmd: 'cat ~/stack | head -6',
    out: 'TypeScript \u00b7 Node.js \u00b7 Fastify \u00b7 React \u00b7 PostgreSQL \u00b7 AWS',
  },
  {
    cmd: 'ls ~/work',
    out: 'xprt/  plank/  hotmart/  robos.im/  teknisa/',
  },
  {
    cmd: 'git log --oneline -1',
    out: 'a1b2c3d feat: joined Xprt \u2014 building Payzen',
  },
  {
    cmd: 'gh pr list -s merged',
    out: '4 merged \u00b7 fastify \u00b7 fluent-json-schema \u00b7 orama',
  },
  {
    cmd: 'uptime',
    out: 'up 10 years \u00b7 5 companies \u00b7 millions of messages/day',
  },
  {
    cmd: 'cat ~/edu.md',
    out: "UFMG \u2014 Engineer's degree, Systems Engineering (2015\u20132021)",
  },
  {
    cmd: 'locale -a',
    out: 'pt-BR native \u00b7 en advanced \u00b7 es intermediate',
  },
] as const

export const careerLog: CareerEntry[] = [
  { hash: 'a1b2c3d', date: '2024-01', kind: 'feat', message: 'joined Xprt — building Payzen', head: true },
  { hash: '9f8e7d6', date: '2023-02', kind: 'feat', message: 'joined Plank — building Jolly' },
  { hash: '5c4b3a2', date: '2019-06', kind: 'feat', message: 'ROBOS.im acquired — joined Hotmart' },
  { hash: '2d1e0f9', date: '2018-03', kind: 'feat', message: 'joined ROBOS.im as Lead Backend Developer' },
  { hash: '8a7b6c5', date: '2015-04', kind: 'feat', message: 'started at Teknisa — intern to full stack engineer' },
] as const

export const experience = [
  {
    company: 'Xprt',
    client: 'Payzen',
    url: null,
    role: 'Senior Software Engineer',
    period: 'Jan 2024 — present',
    bullets: [
      'Joined a 9-engineer team at Payzen, a US healthcare fintech making medical bills affordable through personalized "care now, pay later" payment plans.',
      'Built full-stack features across the server-side rendered onboarding funnel — bill intake, customer onboarding and payment plan selection — on a platform onboarding thousands of new payment plans every day.',
      'Developed the customer self-service platform in React and TanStack, where enrolled patients make extra payments, pause or freeze a plan, and add new bills.',
      'Built Node.js/TypeScript microservices with Fastify and PostgreSQL, deployed on Kubernetes on AWS within a large ecosystem of intercommunicating services, including care-provider integrations.',
      'Worked hands-on with observability every day — Grafana, Sentry, Elasticsearch/Kibana and LogRocket — keeping bills and payments traceable across the microservice ecosystem.',
    ],
    stack: ['TypeScript', 'Node.js', 'Fastify', 'React', 'TanStack', 'PostgreSQL', 'Kubernetes', 'AWS', 'Microservices'],
  },
  {
    company: 'Plank',
    client: 'Jolly',
    url: null,
    role: 'Full Stack Engineer',
    period: 'Feb 2023 — Jan 2024',
    bullets: [
      'Engineer responsible for Jolly, an early-stage platform rewarding caregivers and frontline workers with points redeemable for gift cards, built almost from scratch by a team of four.',
      'Integrated care-provider systems to pull care logs — through their APIs where available, and Puppeteer-based scraping where not.',
      'Built the points engine rewarding good practice: on-time clock-ins, completed missions and well-written care logs.',
      'Built the missions system, where workers set up and accept missions, and the gift card redemption flow.',
      'Built the backend as serverless Node.js/TypeScript AWS Lambda functions.',
    ],
    stack: ['TypeScript', 'Node.js', 'React', 'AWS Lambda', 'Serverless', 'Puppeteer'],
  },
  {
    company: 'Hotmart',
    client: null,
    url: 'https://hotmart.com',
    role: 'Senior Software Engineer, Backend',
    period: 'Jun 2019 — Jan 2023',
    bullets: [
      "Led the transition of ROBOS.im's chat and bot platform into Hotmart after the acquisition, then owned the product end to end.",
      'Designed and built a multi-channel communication system — email, SMS, WhatsApp and chat — handling millions of messages per day.',
      'Built and owned every channel integration, together with the queues and notification topic processing behind them.',
      'Owned the data storage for the messages and the state the system handled.',
      'Built it as a large event-driven architecture on AWS with SNS, SQS and Lambda, plus Node.js microservices owning each channel’s scope.',
      'Carried over the conversation system built at ROBOS.im to power real-time chat across the whole platform.',
    ],
    stack: ['Node.js', 'TypeScript', 'AWS (SNS, SQS, Lambda)', 'Serverless', 'Microservices', 'WebSockets', 'NLU', 'DevOps'],
  },
  {
    company: 'ROBOS.im',
    client: null,
    url: null,
    role: 'Lead Backend Developer',
    period: 'Mar 2018 — Oct 2018',
    bullets: [
      'Lead backend developer on a no-code platform for building AI-driven chatbots, used by businesses to automate customer engagement.',
      'Integrated external NLU services (wit.ai and IBM Watson) so bots could detect user intent with a confidence score and answer the most common questions automatically.',
      'Built the conversation system behind the platform’s chat channel, with real-time messaging over WebSockets — later carried into Hotmart after the acquisition.',
      'Built the backend as Node.js microservices over PostgreSQL and MongoDB.',
    ],
    stack: ['JavaScript', 'Node.js', 'PostgreSQL', 'MongoDB', 'Microservices', 'WebSockets', 'NLU'],
  },
  {
    company: 'Teknisa Software',
    client: null,
    url: null,
    role: 'Full Stack Engineer',
    period: 'Apr 2015 — Feb 2018',
    bullets: [
      'Built a real-time order service and Kitchen Display System (KDS) for food service companies, splitting each order across kitchen sectors and scheduling when each item starts so all dishes for a table are ready at the same time.',
      'Built new components for the internal framework every company product was built on, so product teams could ship features faster and more reliably.',
      'Joined as an intern on the product team, later moved to the internal framework development team.',
    ],
    stack: ['JavaScript', 'AngularJS', 'Node.js', 'SQL'],
  },
] as const

export type Expertise = {
  area: string
  /** Drives the colour of the level word: core reads louder than strong. */
  level: 'core' | 'strong'
  /** How long, or how often. */
  meta: string
  /** What the capability actually is, independent of any one tool. */
  detail: string
  /** The concrete technologies, listed after the capability rather than as the point. */
  tools: string[]
}

export const expertise: Expertise[] = [
  {
    area: 'backend engineering',
    level: 'core',
    meta: '10 yrs',
    detail:
      'Services designed around their contracts: validation at the edge, errors that say what went wrong, and APIs that keep their shape as the product moves underneath them.',
    tools: ['TypeScript', 'Node.js', 'Fastify', 'Express', 'REST APIs', 'type-safe contracts'],
  },
  {
    area: 'distributed systems',
    level: 'core',
    meta: '6 yrs',
    detail:
      'Splitting work across services and queues without losing track of it \u2014 fan-out, idempotent consumers, retries with backoff, and dead letters someone actually reads.',
    tools: ['Kafka', 'RabbitMQ', 'SNS', 'SQS', 'Lambda', 'event-driven', 'queues & DLQs', 'WebSockets'],
  },
  {
    area: 'data modelling',
    level: 'core',
    meta: '10 yrs',
    detail:
      'Letting the access patterns pick the model: normalised where writes need consistency, denormalised where reads dominate, keys and indexes designed before the first query rather than after the first incident. Relational, document and key-value all earn their place somewhere.',
    tools: ['PostgreSQL', 'MySQL', 'DynamoDB', 'MongoDB', 'Elasticsearch', 'Redis', 'SQL & NoSQL'],
  },
  {
    area: 'cloud + delivery',
    level: 'core',
    meta: '6 yrs',
    detail:
      'Running what I build. Containers and functions sized for real traffic, and a deploy path that degrades in pieces instead of failing all at once.',
    tools: ['AWS', 'GCP', 'Kubernetes', 'Docker', 'serverless', 'CI/CD'],
  },
  {
    area: 'observability',
    level: 'strong',
    meta: 'daily',
    detail:
      'Instrumentation decided at design time, not bolted on after the first outage \u2014 enough structured logging, tracing and dashboards to follow one request end to end without shipping a new build.',
    tools: ['Datadog', 'New Relic', 'Grafana', 'Sentry', 'Kibana', 'LogRocket'],
  },
  {
    area: 'product-facing frontend',
    level: 'strong',
    meta: '5 yrs',
    detail:
      'Shipping the whole path when that is what the problem needs: server-rendered flows and data-heavy interfaces sitting on APIs I own.',
    tools: ['React', 'Next.js', 'Astro', 'TanStack', 'SPA', 'SSR'],
  },
]

export const alsoKnown = ['Python', 'Puppeteer', 'LLMs', 'NLU', 'microservices', 'WebSockets'] as const

export const openSource = [
  {
    repo: 'fastify/fastify',
    url: 'https://github.com/fastify/fastify',
    note: 'the Node.js web framework',
    prs: [{ num: 4520, url: 'https://github.com/fastify/fastify/pull/4520' }],
    detail:
      'Passing an incomplete logger instance used to fail silently. Added a validateLogger step and the FST_ERR_LOG_INVALID_LOGGER error so a partial logger throws at startup instead of losing logs at runtime.',
  },
  {
    repo: 'fastify/fluent-json-schema',
    url: 'https://github.com/fastify/fluent-json-schema',
    note: 'fluent API for JSON Schema',
    prs: [
      { num: 160, url: 'https://github.com/fastify/fluent-json-schema/pull/160' },
      { num: 161, url: 'https://github.com/fastify/fluent-json-schema/pull/161' },
    ],
    detail:
      'Added ObjectSchema.without(), which derives a schema by subtracting properties instead of re-listing everything you want to keep, and the JSON Schema 2019-09 deprecated keyword on BaseSchema, TypeScript definitions included.',
  },
  {
    repo: 'oramasearch/orama',
    url: 'https://github.com/oramasearch/orama',
    note: 'full-text search engine, formerly Lyra',
    prs: [{ num: 141, url: 'https://github.com/oramasearch/orama/pull/141' }],
    detail:
      'Rewrote the tokenizer\u2019s diacritics replacer to work on char codes with positional access rather than map lookups \u2014 benchmarked faster in the worst, medium and best case, which speeds up every insert.',
  },
] as const

export const education = [
  {
    school: 'Universidade Federal de Minas Gerais',
    short: 'UFMG',
    degree: "Engineer's degree, Systems Engineering",
    period: '2015 — 2021',
  },
  {
    school: 'Centro Federal de Educação Tecnológica de Minas Gerais',
    short: 'CEFET-MG',
    degree: 'Technical course, Computer Systems Networking and Telecommunications',
    period: '2013 — 2015',
  },
] as const

export const honors = [
  {
    title: 'Hackathon 1st Place — DCC UFMG',
    date: 'Aug 2016',
    url: 'https://www.ufmg.br/online/arquivos/045070.shtml',
    description:
      'First place in a university-wide hackathon with a document-sharing app designed to streamline collaboration among students in the same class.',
  },
] as const

export const languages = [
  { name: 'Portuguese', level: 'native' },
  { name: 'English', level: 'advanced' },
  { name: 'Spanish', level: 'intermediate' },
] as const

/** Nav entries double as command palette targets. */
export const sections = [
  { id: 'about', label: 'about' },
  { id: 'education', label: 'education' },
  { id: 'work', label: 'work' },
  { id: 'stack', label: 'stack' },
  { id: 'open-source', label: 'open source' },
] as const
