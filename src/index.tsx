import { Hono } from 'hono'
import { renderer } from './renderer'
import quoteBuilderApp from './routes/quote-builder'
import apiApp from './routes/api'
import {
  IconArrow, IconCheck, IconX, IconPlus, IconStar, IconMenu,
  IconHealthcare, IconFinance, IconRetail, IconManufacturing,
  IconLogistics, IconEducation, IconLegal, IconRealestate,
  IconSpeed, IconShield, IconIntegration, IconCpu, IconChart, IconHeadset,
  IconTwitter, IconLinkedin, IconGithub, IconYoutube, IconMessage,
} from './components/Icons'
import { AwardBadges } from './components/AwardBadges'
import { CircuitBg } from './components/CircuitBg'

const app = new Hono()

app.use(renderer)

app.route('/quote-builder', quoteBuilderApp)
app.route('/api', apiApp)

const BOOK_DEMO_URL = 'https://app.cal.com/sgctech'

/* ---------- Data ---------- */

const industries = [
  { name: 'Healthcare',    desc: 'Clinical workflows, triage automation, patient support.',   Icon: IconHealthcare },
  { name: 'Finance',       desc: 'Risk analysis, compliance reporting, fraud detection.',     Icon: IconFinance },
  { name: 'Retail & eCom', desc: 'Personalized search, inventory forecasts, smart support.',  Icon: IconRetail },
  { name: 'Manufacturing', desc: 'Predictive maintenance, QA vision, supply optimization.',   Icon: IconManufacturing },
  { name: 'Logistics',     desc: 'Route optimization, fleet insights, demand prediction.',    Icon: IconLogistics },
  { name: 'Education',     desc: 'Adaptive learning, grading assistance, content authoring.', Icon: IconEducation },
  { name: 'Legal',         desc: 'Contract review, case research, discovery acceleration.',   Icon: IconLegal },
  { name: 'Real Estate',   desc: 'Valuation models, tenant screening, deal intelligence.',    Icon: IconRealestate },
]

const airaVoiceAgentData = {
  assistant: 'Aira',
  platform: 'OpenClaw / SGC TECH AI',
  channels: ['voice agent', 'chatbot'],
  actions: ['book demo', 'escalate to human specialist'],
  bookingUrl: BOOK_DEMO_URL,
  capabilities: [
    'Predict & simulate outcomes before action',
    'Connect & integrate across 200+ systems (1000+ business capabilities narrative)',
    'Pull & analyze data in real time',
    'Generate leads and answer customer questions',
    'Book appointments automatically',
    'Trigger intelligent workflow automation 24/7',
    'Track ROI with observability and tracing',
    'Support regulated environments with SOC 2, GDPR, and HIPAA-ready posture',
  ],
  industries: industries.map((industry) => industry.name),
  support: '24/7 priority support with dedicated solutions engineer',
}

const values = [
  { num: '01', title: 'Rapid Deployment', text: 'From kick-off to live production in under 30 days. No six-month pilots, no endless scoping. Fixed scope, fixed price.', Icon: IconSpeed },
  { num: '02', title: 'SOC 2 & GDPR Ready', text: 'Enterprise-grade security baked in. Role-based access, audit trails, data residency controls.',  Icon: IconShield },
  { num: '03', title: '200+ Integrations',  text: 'Salesforce, HubSpot, Snowflake, SAP, Slack, Teams, and your homegrown stack — all on day one.', Icon: IconIntegration },
  { num: '04', title: 'Bring Your Own Model', text: 'OpenAI, Anthropic, Gemini, Mistral, or private models. We stay vendor-neutral, forever.',    Icon: IconCpu },
  { num: '05', title: 'Measurable ROI',     text: 'Built-in observability. Track task completion, time saved, and cost per resolution in real time.', Icon: IconChart },
  { num: '06', title: '24/7 Premium Support', text: 'Dedicated Slack channel, named solutions engineer, SLA-backed response times. Always.',        Icon: IconHeadset },
]

const pricing = [
  {
    tier: 'Starter',
    price: '2,400',
    period: '/month',
    desc: 'For teams validating their first AI workflow in production.',
    featured: false,
    cta: 'Start free pilot',
    features: [
      { text: 'Up to 3 AI agents in production', on: true },
      { text: '10,000 tasks / month',            on: true },
      { text: 'Standard integrations (50+)',     on: true },
      { text: 'Email & chat support',            on: true },
      { text: 'Usage analytics dashboard',       on: true },
      { text: 'Custom model fine-tuning',        on: false },
      { text: 'Dedicated solutions engineer',    on: false },
    ],
  },
  {
    tier: 'Professional',
    price: '7,900',
    period: '/month',
    desc: 'For scaling teams running AI across multiple business functions.',
    featured: true,
    cta: 'Book a demo',
    features: [
      { text: 'Unlimited AI agents',              on: true },
      { text: '150,000 tasks / month',            on: true },
      { text: 'All 200+ integrations',            on: true },
      { text: '24/7 priority support + Slack',    on: true },
      { text: 'Advanced observability & tracing', on: true },
      { text: 'Custom model fine-tuning',         on: true },
      { text: 'Dedicated solutions engineer',     on: true },
    ],
  },
  {
    tier: 'AI Implementation',
    price: null,
    period: '',
    desc: 'We integrate AI into your existing systems — ERPs, CRMs, or custom software.',
    featured: false,
    cta: 'Get started',
    features: [
      { text: 'Integration with ERPs & CRMs',    on: true },
      { text: 'API-first architecture',         on: true },
      { text: 'Data pipeline setup',             on: true },
      { text: 'Workflow automation',           on: true },
      { text: '3-month commitment',         on: true },
      { text: 'Training & handoff',          on: true },
      { text: 'Ongoing support available',    on: false },
    ],
  },
  {
    tier: 'Odoo Custom Modules',
    price: null,
    period: '',
    desc: 'Bespoke Odoo modules tailored to your industry-specific workflows.',
    featured: false,
    cta: 'Build my module',
    features: [
      { text: 'Custom Odoo module development',   on: true },
      { text: 'Industry-specific workflows', on: true },
      { text: 'API integrations',         on: true },
      { text: 'Data migration',           on: true },
      { text: 'Testing & documentation', on: true },
      { text: 'Source code ownership',     on: true },
      { text: 'Annual maintenance opt-in', on: false },
    ],
  },
  {
    tier: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For Fortune 500 deployments with bespoke security and scale needs.',
    featured: false,
    cta: 'Talk to sales',
    features: [
      { text: 'Unlimited agents & unlimited tasks', on: true },
      { text: 'Single-tenant, private deployment',  on: true },
      { text: 'SOC 2 Type II + HIPAA + ISO 27001',  on: true },
      { text: 'On-premise or VPC deployment',       on: true },
      { text: 'Custom SLAs (99.99% uptime)',        on: true },
      { text: 'White-glove onboarding',             on: true },
      { text: 'Named executive sponsor',            on: true },
    ],
  },
]

// Industry success stories — each card matches a custom dashboard screenshot.
// Images live in /public/static/stories/ and titles reflect what each dashboard
// actually shows (LMS, hospital PMS, MRP, POS, BoQ, WMS, CRM, hotel PMS).
const stories = [
  {
    id: 'education',
    tag: 'Education',
    title: 'LMS & Live Classrooms',
    description: 'Student enrolment, attendance, fee status, and live simulated lessons — all in one command centre.',
    metric: '92%',
    metricLabel: 'attendance rate',
    image: '/static/stories/education-lms.jpg',
    href: '#',
  },
  {
    id: 'healthcare',
    tag: 'Healthcare',
    title: 'Hospital Operations',
    description: 'Appointments, insurance claims, pharmacy stock, and billing — reconciled in real time across the facility.',
    metric: 'AED 1,200',
    metricLabel: 'avg patient total',
    image: '/static/stories/healthcare-hospital.jpg',
    href: '#',
  },
  {
    id: 'manufacturing',
    tag: 'Manufacturing',
    title: 'MRP & Shop Floor',
    description: 'Production planning, QC checklists, and shop-floor metrics streamed to every screen on the line.',
    metric: '1.2%',
    metricLabel: 'reject rate',
    image: '/static/stories/manufacturing-mrp.jpg',
    href: '#',
  },
  {
    id: 'retail',
    tag: 'Retail & eCom',
    title: 'Unified Commerce',
    description: 'Omnichannel POS, VIP loyalty, and mobile shopping — one customer, one basket, every channel.',
    metric: '$326',
    metricLabel: 'avg cart value',
    image: '/static/stories/retail-pos.jpg',
    href: '#',
  },
  {
    id: 'construction',
    tag: 'Construction',
    title: 'BoQ & Progress Billing',
    description: 'Cost breakdowns, subcontractor schedules, material tracking, and progress billing — on one screen.',
    metric: '75%',
    metricLabel: 'work completed',
    image: '/static/stories/construction-boq.jpg',
    href: '#',
  },
  {
    id: 'logistics',
    tag: 'Logistics',
    title: 'Warehouse & Customs',
    description: 'Inventory levels, multi-site network, landed-cost analysis, and customs clearance — unified.',
    metric: '125,340',
    metricLabel: 'units tracked',
    image: '/static/stories/logistics-warehouse.jpg',
    href: '#',
  },
  {
    id: 'realestate',
    tag: 'Real Estate',
    title: 'Property CRM',
    description: 'Unit-level sold/available status, owner data, and sales analytics — from listing to close.',
    metric: '275',
    metricLabel: 'total units',
    image: '/static/stories/realestate-crm.jpg',
    href: '#',
  },
  {
    id: 'hospitality',
    tag: 'Hospitality',
    title: 'Hotel & F&B PMS',
    description: 'Reservations, housekeeping, F&B cost control, and restaurant POS — the full property in one pane.',
    metric: 'AED 75,320',
    metricLabel: 'daily revenue',
    image: '/static/stories/hospitality-hotel.jpg',
    href: '#',
  },
]

const testimonials = [
  {
    name: 'Rachel Tanaka', role: 'VP Operations, Meridian Logistics',
    avatar: 'RT',
    quote: 'We were live in under three weeks. The route-optimization agent saved us $340k in the first quarter. Our ops team calls it the hardest-working employee they\'ve ever hired.',
  },
  {
    name: 'Daniel Okonkwo', role: 'CTO, Vertex Financial Group',
    avatar: 'DO',
    quote: 'SGC TECH passed our security review faster than any vendor we\'ve onboarded. The model-agnostic architecture means we\'re not locked into a single LLM provider. That\'s rare.',
  },
  {
    name: 'Priya Venkatesh', role: 'Head of CX, Northwind Retail',
    avatar: 'PV',
    quote: 'Support ticket resolution time dropped 63%. Not hype — actual data from our Zendesk instance. The agents sound like our best senior reps, not a chatbot.',
  },
]

const faqs = [
  {
    q: 'How fast can we realistically go live?',
    a: 'Most clients are in full production within 30 days of kick-off. We scope narrowly, staff experienced engineers, and iterate fast. Simpler workflows land sooner — complex, multi-system deployments sit at the upper end. Either way, you\'re live in weeks, not quarters.',
  },
  {
    q: 'Which LLM providers do you support?',
    a: 'All of them. OpenAI (GPT-4o, o1), Anthropic (Claude), Google (Gemini), Mistral, Cohere, and any private or open-source model you run on your own infrastructure. Our orchestration layer is model-agnostic by design.',
  },
  {
    q: 'Is my data used to train models?',
    a: 'Never. Your data stays in your tenant. We offer private VPC deployments and on-premise options for regulated industries. We are SOC 2 Type II, GDPR compliant, and HIPAA-ready.',
  },
  {
    q: 'How do you price enterprise deployments?',
    a: 'Enterprise pricing is based on deployment scope, integration complexity, and compliance requirements — not seat count. Most Fortune 500 engagements start at $30k/month with transparent volume-based scaling.',
  },
  {
    q: 'What happens if an agent makes a mistake?',
    a: 'Every agent runs inside a confidence-scored guardrail framework. Low-confidence actions are routed to human review. All decisions are logged, explainable, and reversible. You own the audit trail.',
  },
  {
    q: 'Can we start with a pilot before the full deployment?',
    a: 'Yes. Our Starter pilot is a full production deployment — not a sandbox demo. You get real agents, real integrations, and real outcomes. No long-term commitment required.',
  },
]

/* ---------- Aira Memory API ---------- */

app.get('/api/aira/memory', async (c) => {
  const sessionId = c.req.query('sessionId')?.trim()
  if (!sessionId) {
    return c.json({ ok: false, error: 'sessionId is required' }, 400)
  }

  const kv = (c.env as any)?.AIRA_BRAIN_KV
  if (!kv || typeof kv.get !== 'function') {
    return c.json({
      ok: false,
      error: 'AIRA_BRAIN_KV binding is missing',
      pending: [
        'Create a Cloudflare KV namespace',
        'Bind it in wrangler.jsonc as AIRA_BRAIN_KV',
        'Deploy with the binding available in this environment',
      ],
    }, 503)
  }

  const key = `aira:session:${sessionId}`
  const data = await kv.get(key, { type: 'json' })
  return c.json({ ok: true, data: data ?? null })
})

app.post('/api/aira/memory', async (c) => {
  let body: any = null
  try {
    body = await c.req.json()
  } catch {
    return c.json({ ok: false, error: 'Invalid JSON body' }, 400)
  }

  const sessionId = typeof body?.sessionId === 'string' ? body.sessionId.trim() : ''
  if (!sessionId || sessionId.length > 128) {
    return c.json({ ok: false, error: 'sessionId must be a non-empty string up to 128 chars' }, 400)
  }

  const kv = (c.env as any)?.AIRA_BRAIN_KV
  if (!kv || typeof kv.put !== 'function') {
    return c.json({
      ok: false,
      error: 'AIRA_BRAIN_KV binding is missing',
      pending: [
        'Create a Cloudflare KV namespace',
        'Bind it in wrangler.jsonc as AIRA_BRAIN_KV',
        'Deploy with the binding available in this environment',
      ],
    }, 503)
  }

  const now = new Date().toISOString()
  const key = `aira:session:${sessionId}`
  const existing = await kv.get(key, { type: 'json' })

  const payload = {
    sessionId,
    history: Array.isArray(body?.history) ? body.history.slice(-120) : [],
    events: Array.isArray(body?.events) ? body.events.slice(-300) : [],
    brainState: typeof body?.brainState === 'object' && body?.brainState !== null ? body.brainState : null,
    createdAt: (existing as any)?.createdAt ?? now,
    updatedAt: now,
  }

  await kv.put(key, JSON.stringify(payload), {
    expirationTtl: 60 * 60 * 24 * 90,
    metadata: {
      updatedAt: now,
      leadScore: (payload as any)?.brainState?.leadScore ?? 0,
      turns: (payload as any)?.brainState?.turns ?? 0,
      messageCount: Array.isArray(payload.history) ? payload.history.length : 0,
    },
  })

  return c.json({ ok: true, saved: true, updatedAt: now })
})

/* ---------- Aira Chat Proxy ---------- */

interface AiraChatRequest {
  message?: unknown
  source?: unknown
  sessionId?: unknown
}

const MAX_MESSAGE_LENGTH = 4000
const MAX_SESSION_ID_LENGTH = 128
const VALID_SOURCES = ['chat', 'voice', 'widget', 'api']

app.post('/api/aira/chat', async (c) => {
  let body: AiraChatRequest | null = null
  try {
    body = await c.req.json()
  } catch {
    return c.json({ ok: false, error: 'Invalid JSON body' }, 400)
  }

  // Validate message
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return c.json({ ok: false, error: 'message required and must be under 4000 characters' }, 400)
  }

  // Validate source
  const source = VALID_SOURCES.includes(body?.source as string) ? (body?.source as string) : 'chat'

  // Validate session ID
  const sessionId =
    typeof body?.sessionId === 'string' && body.sessionId.length <= MAX_SESSION_ID_LENGTH
      ? body.sessionId.trim()
      : crypto.randomUUID()

  // Fetch with timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  let resp: Response
  try {
    resp = await fetch('https://aira.tachimao.com/web/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message, session_id: sessionId }),
      signal: controller.signal,
    })
  } catch {
    clearTimeout(timeoutId)
    return c.json({ ok: false, reply: 'Unable to process your request. Please try again in a moment.' }, 502)
  }

  clearTimeout(timeoutId)

  if (!resp.ok) {
    return c.json({ ok: false, reply: 'Unable to process your request. Please try again in a moment.' }, 502)
  }

  const rawResponse = resp.headers.get('x-response') ?? ''
  let reply = "I'm having trouble formulating a response right now. Please try again."
  if (rawResponse) {
    try {
      reply = atob(rawResponse)
    } catch (decodeError) {
      console.error('Failed to decode x-response header:', decodeError)
      return c.json({ ok: false, reply: 'Unable to process response. Please try again.' }, 500)
    }
  }

  // Validate upstream session ID
  const upstreamSessionId = resp.headers.get('x-session-id')
  const newSessionId =
    upstreamSessionId && /^[a-zA-Z0-9\-_]{1,128}$/.test(upstreamSessionId) ? upstreamSessionId : sessionId

  return c.json({ ok: true, reply, sessionId: newSessionId, source })
})

const isAdminAuthorized = (c: any) => {
  const requiredToken = (c.env as any)?.ADMIN_TOKEN
  if (!requiredToken) return true

  const queryToken = c.req.query('token')
  const headerToken = c.req.header('x-admin-token')
  return queryToken === requiredToken || headerToken === requiredToken
}

app.get('/api/admin/aira/sessions', async (c) => {
  if (!isAdminAuthorized(c)) {
    return c.json({ ok: false, error: 'Unauthorized' }, 401)
  }

  const kv = (c.env as any)?.AIRA_BRAIN_KV
  if (!kv || typeof kv.list !== 'function') {
    return c.json({
      ok: false,
      error: 'AIRA_BRAIN_KV binding is missing',
    }, 503)
  }

  const limit = Math.min(Number(c.req.query('limit') || 20), 50)
  const cursor = c.req.query('cursor') || undefined
  const includeDetail = c.req.query('detail') === 'true'

  const listed = await kv.list({
    prefix: 'aira:session:',
    limit,
    cursor,
  })

  const sessions = await Promise.all(listed.keys.map(async (k: any) => {
    const sessionId = String(k.name).replace('aira:session:', '')
    const meta = (k as any).metadata || {}

    let detail: any = null
    if (includeDetail) {
      detail = await kv.get(k.name, { type: 'json' })
    }

    if (!includeDetail && !meta.updatedAt) {
      const raw = await kv.get(k.name, { type: 'json' })
      if (raw) {
        return {
          sessionId,
          updatedAt: (raw as any).updatedAt ?? null,
          leadScore: (raw as any)?.brainState?.leadScore ?? 0,
          turns: (raw as any)?.brainState?.turns ?? 0,
          messageCount: Array.isArray((raw as any)?.history) ? (raw as any).history.length : 0,
          summary: {
            company: (raw as any)?.brainState?.profile?.company ?? '',
            role: (raw as any)?.brainState?.profile?.role ?? '',
            lastIntent: (raw as any)?.brainState?.lastIntent ?? '',
          },
        }
      }
    }

    return {
      sessionId,
      updatedAt: meta.updatedAt ?? null,
      leadScore: meta.leadScore ?? 0,
      turns: meta.turns ?? 0,
      messageCount: meta.messageCount ?? 0,
      summary: detail ? {
        company: detail?.brainState?.profile?.company ?? '',
        role: detail?.brainState?.profile?.role ?? '',
        lastIntent: detail?.brainState?.lastIntent ?? '',
      } : null,
      detail: includeDetail ? detail : undefined,
    }
  }))

  sessions.sort((a, b) => {
    const da = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
    const db = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
    return db - da
  })

  return c.json({
    ok: true,
    sessions,
    cursor: listed.cursor,
    listComplete: listed.list_complete,
  })
})

app.get('/api/admin/aira/session/:sessionId', async (c) => {
  if (!isAdminAuthorized(c)) {
    return c.json({ ok: false, error: 'Unauthorized' }, 401)
  }

  const kv = (c.env as any)?.AIRA_BRAIN_KV
  if (!kv || typeof kv.get !== 'function') {
    return c.json({ ok: false, error: 'AIRA_BRAIN_KV binding is missing' }, 503)
  }

  const sessionId = c.req.param('sessionId')?.trim()
  if (!sessionId) {
    return c.json({ ok: false, error: 'sessionId is required' }, 400)
  }

  const key = `aira:session:${sessionId}`
  const detail = await kv.get(key, { type: 'json' })
  if (!detail) {
    return c.json({ ok: false, error: 'Session not found' }, 404)
  }

  return c.json({ ok: true, sessionId, detail })
})

app.get('/admin/aira-memory', async (c) => {
  if (!isAdminAuthorized(c)) {
    return c.text('Unauthorized. Provide ?token=YOUR_ADMIN_TOKEN', 401)
  }

  return c.render(
    <main style="padding: 6rem 1.2rem 2rem; max-width: 1100px; margin: 0 auto;">
      <section class="glass" style="padding: 1.25rem; border-radius: 16px;">
        <h1 style="font-size: 1.6rem; margin-bottom: 0.4rem;">Aira Conversation Dashboard</h1>
        <p style="margin-bottom: 1rem; color: var(--gray-300);">Read recent conversations, lead scores, and session context.</p>
        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.9rem;">
          <button id="refreshBtn" class="btn btn-primary" style="padding: 0.55rem 1rem;">Refresh</button>
          <button id="loadMoreBtn" class="btn btn-ghost" style="padding: 0.55rem 1rem;">Load more</button>
          <span id="adminStatus" style="align-self: center; color: var(--gray-400);">Loading sessions...</span>
        </div>
        <div style="overflow: auto; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px;">
          <table style="width: 100%; border-collapse: collapse; min-width: 920px;">
            <thead>
              <tr style="text-align: left; background: rgba(255,255,255,0.03);">
                <th style="padding: 0.65rem;">Session</th>
                <th style="padding: 0.65rem;">Updated</th>
                <th style="padding: 0.65rem;">Lead Score</th>
                <th style="padding: 0.65rem;">Turns</th>
                <th style="padding: 0.65rem;">Messages</th>
                <th style="padding: 0.65rem;">Company</th>
                <th style="padding: 0.65rem;">Role</th>
                <th style="padding: 0.65rem;">Action</th>
              </tr>
            </thead>
            <tbody id="sessionsBody"></tbody>
          </table>
        </div>
      </section>

      <section class="glass" style="padding: 1.25rem; border-radius: 16px; margin-top: 1rem;">
        <h2 style="font-size: 1.1rem; margin-bottom: 0.5rem;">Conversation Detail</h2>
        <pre id="sessionDetail" style="white-space: pre-wrap; margin: 0; color: var(--gray-100); max-height: 420px; overflow: auto;"></pre>
      </section>

      <script>{`
        (() => {
          const state = { cursor: '', token: new URLSearchParams(window.location.search).get('token') || '' }
          const body = document.getElementById('sessionsBody')
          const detail = document.getElementById('sessionDetail')
          const status = document.getElementById('adminStatus')
          const refreshBtn = document.getElementById('refreshBtn')
          const loadMoreBtn = document.getElementById('loadMoreBtn')

          const fmtDate = (v) => {
            if (!v) return '-'
            const d = new Date(v)
            return Number.isNaN(d.getTime()) ? '-' : d.toLocaleString()
          }

          const esc = (v) => String(v || '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]))

          const buildUrl = (cursor = '', detailMode = false) => {
            const q = new URLSearchParams()
            q.set('limit', '20')
            if (cursor) q.set('cursor', cursor)
            if (detailMode) q.set('detail', 'true')
            if (state.token) q.set('token', state.token)
            return '/api/admin/aira/sessions?' + q.toString()
          }

          const loadSessions = async (append = false) => {
            status.textContent = 'Loading sessions...'
            try {
              const res = await fetch(buildUrl(append ? state.cursor : ''))
              const payload = await res.json()
              if (!res.ok || !payload.ok) {
                status.textContent = payload.error || 'Failed to load sessions.'
                return
              }

              if (!append) body.innerHTML = ''

              payload.sessions.forEach((s) => {
                const tr = document.createElement('tr')
                tr.innerHTML = 
                  '<td style="padding:0.6rem;">' + esc(s.sessionId) + '</td>' +
                  '<td style="padding:0.6rem;">' + esc(fmtDate(s.updatedAt)) + '</td>' +
                  '<td style="padding:0.6rem;">' + esc(s.leadScore) + '</td>' +
                  '<td style="padding:0.6rem;">' + esc(s.turns) + '</td>' +
                  '<td style="padding:0.6rem;">' + esc(s.messageCount) + '</td>' +
                  '<td style="padding:0.6rem;">' + esc(s.summary?.company || '-') + '</td>' +
                  '<td style="padding:0.6rem;">' + esc(s.summary?.role || '-') + '</td>' +
                  '<td style="padding:0.6rem;"><button data-session="' + esc(s.sessionId) + '" class="btn btn-ghost" style="padding:0.35rem 0.65rem;">View</button></td>'
                body.appendChild(tr)
              })

              state.cursor = payload.cursor || ''
              loadMoreBtn.disabled = !!payload.listComplete
              status.textContent = 'Loaded ' + payload.sessions.length + ' sessions.'
            } catch (err) {
              status.textContent = 'Error loading sessions.'
            }
          }

          const loadSessionDetail = async (sessionId) => {
            status.textContent = 'Loading detail for ' + sessionId + '...'
            try {
              const q = new URLSearchParams()
              if (state.token) q.set('token', state.token)
              const res = await fetch('/api/admin/aira/session/' + encodeURIComponent(sessionId) + (q.toString() ? ('?' + q.toString()) : ''))
              const payload = await res.json()
              if (!res.ok || !payload.ok) {
                status.textContent = payload.error || 'Failed to load detail.'
                return
              }
              detail.textContent = JSON.stringify(payload.detail || { message: 'No detail found.' }, null, 2)
              status.textContent = 'Detail loaded for ' + sessionId + '.'
            } catch {
              status.textContent = 'Error loading detail.'
            }
          }

          body.addEventListener('click', (e) => {
            const target = e.target
            if (!(target instanceof HTMLElement)) return
            const sessionId = target.getAttribute('data-session')
            if (!sessionId) return
            loadSessionDetail(sessionId)
          })

          refreshBtn.addEventListener('click', () => {
            state.cursor = ''
            loadSessions(false)
          })

          loadMoreBtn.addEventListener('click', () => {
            if (!state.cursor) return
            loadSessions(true)
          })

          loadSessions(false)
        })()
      `}</script>
    </main>
  )
})

/* ---------- Page ---------- */

app.get('/', (c) => {
  return c.render(
    <>
      {/* ============== NAV ============== */}
      <nav class="nav" aria-label="Primary">
        <div class="container nav-inner">
          <a href="#top" class="nav-logo" aria-label="SGC TECH AI Home">
            <img src="/static/sgc-tech-logo.png" alt="SGC TECH AI" />
            <span>SGC <span style="color: var(--cyan)">TECH</span></span>
          </a>
          <ul class="nav-links" role="menubar">
            <li><a href="#industries">Industries</a></li>
            <li><a href="#why">Why SGC</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#testimonials">Customers</a></li>
            <li><a href="#stories">Stories</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="/quote-builder" class="nav-quote-link">Quote Builder</a></li>
          </ul>
          <div class="nav-cta">
            <a href="https://scholarixglobal.com/web/login" class="btn btn-ghost" style="padding: 0.55rem 1.1rem;" target="_blank" rel="noopener noreferrer">Sign in</a>
            <a href={BOOK_DEMO_URL} class="btn btn-primary" style="padding: 0.55rem 1.1rem;" data-magnetic target="_blank" rel="noopener noreferrer">
              Book Demo <IconArrow />
            </a>
            <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">
              <IconMenu />
            </button>
          </div>
        </div>
      </nav>

      <main id="top">

        {/* ============== HERO ============== */}
        <section class="hero">
          {/* Interactive particle field — loaded via particles.js CDN */}
          <div id="particles-js" aria-hidden="true"></div>
          <CircuitBg />
          <div class="container">
            <div class="hero-grid">
              <div>
                <div class="hero-badge reveal">
                  <span class="dot"></span>
                  <span>AI-Powered · Real Cost Savings · Real Results</span>
                </div>

                {/* Pain-point narrative frame */}
                <div class="hero-pain reveal reveal-delay-1">
                  <p class="pain-top">Your business deserves <em>better than this.</em></p>

                  <div class="pain-stage" aria-live="polite" aria-atomic="true">
                    <span class="pain-arrow" aria-hidden="true">→</span>
                    <p class="pain-text" id="painText">Chasing approvals on WhatsApp.</p>
                  </div>

                  <h1 class="pain-bottom">
                    SGC Tech AI fixes it.<br />
                    <span class="text-gradient-cyan">Fixed price. Fixed timeline.</span>
                  </h1>
                </div>

                <div class="hero-ctas reveal reveal-delay-2">
                  <a href="#pricing" class="btn btn-primary btn-lg" data-magnetic>
                    Calculate your ROI <IconArrow />
                  </a>
                  <a href="#why" class="btn btn-ghost btn-lg">
                    See how it works
                  </a>
                </div>

                <AwardBadges />

                <div class="hero-stats reveal reveal-delay-4">
                  <div>
                    <div class="stat-value"><span data-count="30" data-suffix="">0</span></div>
                    <div class="stat-label">Day deployment</div>
                  </div>
                  <div>
                    <div class="stat-value"><span data-count="63" data-suffix="%">0</span></div>
                    <div class="stat-label">Avg cost reduction</div>
                  </div>
                  <div>
                    <div class="stat-value"><span data-count="200" data-suffix="+">0</span></div>
                    <div class="stat-label">Integrations</div>
                  </div>
                </div>
              </div>

              <div class="hero-visual reveal-right reveal-delay-2" aria-hidden="true">
                <div class="hero-visual-glow"></div>
                <div class="hero-ring hero-ring-3"></div>
                <div class="hero-ring hero-ring-2"></div>
                <div class="hero-orbit"></div>
                <div class="hero-logo-wrap">
                  <img src="/static/sgc-tech-logo.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============== TRUST BAR ============== */}
        <section class="trust-bar">
          <div class="container" style="margin-bottom: 1.5rem;">
            <p style="text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gray-500);">
              Cutting costs and optimizing operations at <span style="color: var(--cyan);">500+ companies</span> worldwide
            </p>
          </div>
          <div class="marquee">
            {(() => {
              // Real brand logos via Simple Icons CDN — all verified to return 200.
              // CSS filter converts the SVG to white for dark-theme display.
              const brands = [
                { name: 'Google Cloud', slug: 'google' },
                { name: 'SAP',          slug: 'sap' },
                { name: 'Cisco',        slug: 'cisco' },
                { name: 'Snowflake',    slug: 'snowflake' },
                { name: 'Databricks',   slug: 'databricks' },
                { name: 'Cloudflare',   slug: 'cloudflare' },
                { name: 'Atlassian',    slug: 'atlassian' },
                { name: 'HubSpot',      slug: 'hubspot' },
                { name: 'Shopify',      slug: 'shopify' },
                { name: 'Stripe',       slug: 'stripe' },
                { name: 'NVIDIA',       slug: 'nvidia' },
                { name: 'MongoDB',      slug: 'mongodb' },
              ]
              // Duplicate the array for a seamless loop
              const loop = [...brands, ...brands]
              return loop.map((b) => (
                <span class="marquee-item">
                  <img
                    src={`https://cdn.simpleicons.org/${b.slug}`}
                    alt={b.name}
                    loading="lazy"
                    width="32"
                    height="32"
                  />
                  {b.name}
                </span>
              ))
            })()}
          </div>
        </section>

        {/* ============== INDUSTRIES ============== */}
        <section id="industries" class="section-ambient" style="--sg-color: rgba(0,217,255,0.06)">
          <div class="container">
            <div class="section-header reveal-blur">
              <span class="section-label">01 · Industries</span>
              <h2>Built for the industries <span class="text-gradient-cyan">most allergic</span> to AI hype.</h2>
              <p class="lead">We specialize in compliance-heavy, revenue-critical workflows where "move fast and break things" is a career-ending strategy.</p>
            </div>

            <div class="industries-grid stagger-children">
              {industries.map((ind, i) => (
                <article class="glass industry-card">
                  <span class="index">{String(i + 1).padStart(2, '0')}</span>
                  <div class="icon"><ind.Icon /></div>
                  <div>
                    <div class="name">{ind.name}</div>
                    <div class="desc">{ind.desc}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============== WHY SGC TECH ============== */}
        <section id="why" class="section-ambient" style="--sg-color: rgba(0,71,255,0.07)">
          <div class="container">
            <div class="section-glass">
              <div class="section-header reveal-blur">
                <span class="section-label">02 · Why SGC TECH AI</span>
                <h2>Six reasons our customers <br /><span class="text-gradient-cyan">don't renew</span> — they expand.</h2>
                <p class="lead">Average net-revenue retention sits at 143%. That's not a marketing number. That's what happens when the product actually works.</p>
              </div>

              <div class="values-grid stagger-children">
                {values.map((v, i) => (
                  <article class="glass value-card" data-holo>
                    <div class="num">{v.num}</div>
                    <div class="icon-ring"><v.Icon /></div>
                    <h3>{v.title}</h3>
                    <p>{v.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============== PRICING ============== */}
        <section id="pricing" class="section-ambient" style="--sg-color: rgba(0,217,255,0.05)">
          <div class="container">
            <div class="section-header center reveal-blur">
              <span class="section-label">03 · Pricing</span>
              <h2>Fixed-price tiers.<br /><span class="text-gradient-cyan">No "contact us" games</span> for the first two.</h2>
              <p class="lead" style="margin-left: auto; margin-right: auto;">Transparent pricing because enterprise software shouldn't feel like buying a used car.</p>
            </div>

            <div class="pricing-grid stagger-children">
              {pricing.map((p, i) => (
                <article class={`glass pricing-card ${p.featured ? 'featured' : ''}`}>
                  {p.featured && <span class="pricing-tag">Most Popular</span>}
                  <div class="pricing-tier">{p.tier}</div>

                  <div class="pricing-price">
                    {p.price === 'Custom' ? (
                      <span class="amount">Custom</span>
                    ) : p.price === null ? (
                      <span class="amount" style="font-size: 0.65em; opacity: 0.7;">Request Quote</span>
                    ) : (
                      <>
                        <span class="currency">$</span>
                        <span class="amount">{p.price}</span>
                        <span class="period">{p.period}</span>
                      </>
                    )}
                  </div>

                  <p class="pricing-desc">{p.desc}</p>

                  <div class="pricing-divider"></div>

                  <ul class="pricing-features">
                    {p.features.map((f) => (
                      <li class={f.on ? '' : 'dim'}>
                        <span class="check">{f.on ? <IconCheck /> : <IconX />}</span>
                        <span>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={p.cta.toLowerCase() === 'book a demo' ? BOOK_DEMO_URL : '#contact'}
                    class={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'}`}
                    data-magnetic
                    target={p.cta.toLowerCase() === 'book a demo' ? '_blank' : undefined}
                    rel={p.cta.toLowerCase() === 'book a demo' ? 'noopener noreferrer' : undefined}
                  >
                    {p.cta} <IconArrow />
                  </a>
                </article>
              ))}
            </div>

            {/* Quote Builder CTA */}
            <div style="text-align: center; margin-top: 2.5rem;" class="reveal">
              <p style="color: var(--gray-300); margin-bottom: 1rem;">Not sure which plan fits? Build a custom AED quote in 2 minutes.</p>
              <a href="/quote-builder" class="btn btn-ghost" style="padding: 0.7rem 1.6rem;">
                Open Quote Builder →
              </a>
            </div>
          </div>
        </section>
        <section id="testimonials" class="section-ambient" style="--sg-color: rgba(0,71,255,0.06)">
          <div class="container">
            <div class="section-glass">
              <div class="section-header reveal-blur">
                <span class="section-label">04 · Customers</span>
                <h2>What the people <span class="text-gradient-cyan">actually writing checks</span> say.</h2>
                <p class="lead">Verified quotes from active customers. LinkedIn-checkable. Case studies available under NDA.</p>
              </div>

              <div class="testimonials-grid stagger-children">
                {testimonials.map((t, i) => (
                  <article class="glass testimonial-card">
                    <div class="quote-mark">"</div>
                    <div class="stars" aria-label="5 out of 5 stars">
                      {[...Array(5)].map(() => <IconStar />)}
                    </div>
                    <p class="quote">{t.quote}</p>
                    <div class="testimonial-author">
                      <div class="avatar">{t.avatar}</div>
                      <div class="author-info">
                        <div class="name">{t.name}</div>
                        <div class="role">{t.role}</div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============== CUSTOMER SUCCESS STORIES (CARD STACK) ============== */}
        <section class="stories-section" id="stories">
          <div class="container">
            <div class="section-header center reveal-blur">
              <span class="section-label">05 · Industry Solutions</span>
              <h2>One platform. <span class="text-gradient-cyan">Eight verticals.</span></h2>
              <p class="lead" style="margin-left: auto; margin-right: auto;">
                Drag, swipe, or use the arrows. Each card is a real production dashboard we've shipped —
                education, healthcare, manufacturing, retail, construction, logistics, real estate, hospitality.
              </p>
            </div>

            <div
              class="card-stack reveal"
              data-max-visible="5"
              data-overlap="0.52"
              data-loop="true"
              data-autoplay="true"
              data-interval="3800"
              data-pause-hover="true"
              aria-roledescription="carousel"
              aria-label="Customer success stories"
            >
              <div class="card-stack-stage">
                <div class="card-stack-viewport">
                  {stories.map((s) => (
                    <article
                      class="stack-card"
                      data-id={s.id}
                      data-href={s.href}
                      aria-label={`${s.title} — ${s.description}`}
                    >
                      <div class="stack-card-inner">
                        <img src={s.image} alt={s.title} loading="lazy" draggable={false} />
                        <div class="stack-card-overlay"></div>
                        <div class="stack-card-content">
                          <span class="stack-tag">{s.tag}</span>
                          <h3 class="stack-title">{s.title}</h3>
                          <p class="stack-desc">{s.description}</p>
                          <div class="stack-metric">
                            <span class="value">{s.metric}</span>
                            <span class="metric-label">{s.metricLabel}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div class="card-stack-controls">
                <button class="cs-nav-btn" data-cs-prev aria-label="Previous story">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <div class="cs-dots" role="tablist">
                  {stories.map((s, i) => (
                    <button
                      class={`cs-dot${i === 0 ? ' on' : ''}`}
                      data-cs-dot={i}
                      role="tab"
                      aria-label={`Go to ${s.title}`}
                    ></button>
                  ))}
                </div>

                <button class="cs-nav-btn" data-cs-next aria-label="Next story">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>

                <a href="#" target="_blank" rel="noopener noreferrer" class="cs-external" aria-label="Open case study">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============== FAQ ============== */}
        <section id="faq" class="section-ambient" style="--sg-color: rgba(0,217,255,0.04)">
          <div class="container">
            <div class="section-header center reveal-blur">
              <span class="section-label">06 · FAQ</span>
              <h2>The answers <span class="text-gradient-cyan">before you ask.</span></h2>
            </div>

            <div class="faq-wrap section-glass">
              {faqs.map((f, i) => (
                <details class="glass faq-item reveal" style={`transition-delay: ${i * 50}ms`}>
                  <summary class="faq-summary">
                    <h4>{f.q}</h4>
                    <span class="faq-icon"><IconPlus /></span>
                  </summary>
                  <div class="faq-answer">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============== FINAL CTA ============== */}
        <section class="cta-section" id="contact">
          <div class="container">
            <div class="cta-card section-glass reveal-blur">
              <div class="cta-grid">
                <div>
                  <span class="section-label">Ready when you are</span>
                  <h2>Fourteen days from now,<br />your AI is <span class="text-gradient-cyan">already shipping value.</span></h2>
                  <p class="lead">Book a 30-minute scoping call. We'll walk through your highest-leverage workflow and map out exactly what your first 30 days look like — week by week.</p>
                </div>
                <div class="cta-buttons">
                  <a href={BOOK_DEMO_URL} class="btn btn-primary" data-magnetic target="_blank" rel="noopener noreferrer">
                    Book a 30-min call <IconArrow />
                  </a>
                  <a href="#pricing" class="btn btn-ghost">
                    Start free pilot
                  </a>
                  <p class="cta-note">No credit card · Cancel anytime</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Welcome popup — shown once per session, dismissed by picking Chat or Voice */}
      <div id="aira-welcome-popup" class="aira-welcome-overlay" aria-modal="true" role="dialog" aria-label="Welcome to SGC TECH AI">
        <div class="aira-welcome-card">
          <p class="aira-welcome-title">Welcome to SGC TECH AI</p>
          <p class="aira-welcome-body">We help B2B teams cut operational cost, automate workflows, and deploy production AI in as little as 30 days.</p>
          <div class="aira-welcome-actions">
            <button type="button" class="aira-welcome-btn aira-welcome-chat" data-welcome-mode="chat">Chat</button>
            <button type="button" class="aira-welcome-btn aira-welcome-voice" data-welcome-mode="voice">Voice</button>
          </div>
        </div>
      </div>

      <div
        class="aira-chatbox"
        data-booking-url={BOOK_DEMO_URL}
        data-alert-phone="971563905772"
        data-memory-api="/api/aira/memory"
      >
        <button
          type="button"
          class="floating-message-btn"
          data-chat-launcher
          aria-label="Open Aira chat assistant"
          aria-expanded="false"
          title={JSON.stringify(airaVoiceAgentData)}
        >
          <IconMessage />
          <span>Message Aira</span>
        </button>

        <section class="aira-chat-panel" data-chat-panel hidden>
          <header class="aira-chat-header">
            <p class="aira-chat-eyebrow">Aira Sales Assistant</p>
            <button type="button" class="aira-chat-close" data-chat-close aria-label="Close chatbox">x</button>
          </header>

          <div class="aira-chat-body">
            <div class="aira-mode-switch" role="tablist" aria-label="Assistant mode">
              <button type="button" class="aira-mode-btn active" data-mode="chat" role="tab" aria-selected="true">Chat</button>
              <button type="button" class="aira-mode-btn" data-mode="voice" role="tab" aria-selected="false">Voice</button>
            </div>

            <div class="aira-chat-log" data-chat-log aria-live="polite" aria-label="Aira conversation history"></div>

            <form class="aira-chat-form" data-chat-form>
              <input
                type="text"
                id="aira-chat-input"
                name="airaMessage"
                class="aira-chat-input"
                data-chat-input
                placeholder="Type your message..."
                autocomplete="off"
              />
              <button type="submit" class="aira-chat-send">Send</button>
            </form>

            <div class="aira-voice-panel" data-voice-panel hidden>
              <div class="aira-voice-recorder">
                <div class="aira-voice-visualizer" id="aira-voice-visualizer">
                  <div class="aira-voice-bars">
                    <span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span>
                  </div>
                </div>
                <p class="aira-voice-status" id="aira-voice-status">Tap the microphone to start</p>
                <button type="button" class="aira-voice-mic-btn" data-voice-toggle id="aira-voice-mic-btn">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </button>
                <p class="aira-voice-hint">Or press and hold Space to talk</p>
              </div>
            </div>

            <div class="aira-quick-actions">
              <a href={BOOK_DEMO_URL} target="_blank" rel="noopener noreferrer" class="aira-quick-btn" data-book-demo>
                Book Demo
              </a>
              <button type="button" class="aira-quick-btn aira-quick-human" data-talk-human>
                Talk to Human
              </button>
            </div>

            <div class="aira-alert-links" data-alert-links hidden>
              <a href="#" target="_blank" rel="noopener noreferrer" class="aira-alert-btn" data-alert-whatsapp>
                Use WhatsApp
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" class="aira-alert-btn" data-alert-telegram>
                Use Telegram
              </a>
            </div>

          </div>
        </section>
      </div>

      {/* ============== FOOTER ============== */}
      <footer>
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a href="#top" class="nav-logo">
                <img src="/static/sgc-tech-logo.png" alt="SGC TECH AI" style="width: 44px; height: 44px;" />
                <span>SGC <span style="color: var(--cyan)">TECH</span></span>
              </a>
              <p>Production AI for regulated enterprises. Fixed scope, fixed price, live within 30 days — from handshake to real business impact.</p>
            </div>

            <div class="footer-col">
              <h5>Product</h5>
              <ul>
                <li><a href="#industries">Industries</a></li>
                <li><a href="#why">Platform</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#">Integrations</a></li>
                <li><a href="#">Changelog</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h5>Company</h5>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#testimonials">Customers</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h5>Legal</h5>
              <ul>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Security</a></li>
                <li><a href="#">DPA</a></li>
                <li><a href="#">SOC 2 Report</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <p>© {new Date().getFullYear()} SGC TECH AI · All rights reserved · Built for teams that ship.</p>
            <div class="social">
              <a href="#" aria-label="Twitter / X"><IconTwitter /></a>
              <a href="#" aria-label="LinkedIn"><IconLinkedin /></a>
              <a href="#" aria-label="GitHub"><IconGithub /></a>
              <a href="#" aria-label="YouTube"><IconYoutube /></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
})

/* ---------- SEO Routes ---------- */

app.get('/sitemap.xml', async (c) => {
  c.header('Content-Type', 'application/xml; charset=utf-8')
  return c.text(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Homepage - Main Entry Point -->
  <url>
    <loc>https://sgctech.ai</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Homepage Sections -->
  <url>
    <loc>https://sgctech.ai/#top</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>

  <!-- Industries Section -->
  <url>
    <loc>https://sgctech.ai/#industries</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
    <image:image>
      <image:loc>https://sgctech.ai/static/stories/healthcare-hospital.jpg</image:loc>
      <image:title>Healthcare Hospital Operations</image:title>
    </image:image>
    <image:image>
      <image:loc>https://sgctech.ai/static/stories/manufacturing-mrp.jpg</image:loc>
      <image:title>Manufacturing MRP Shop Floor</image:title>
    </image:image>
    <image:image>
      <image:loc>https://sgctech.ai/static/stories/retail-pos.jpg</image:loc>
      <image:title>Retail Unified Commerce</image:title>
    </image:image>
    <image:image>
      <image:loc>https://sgctech.ai/static/stories/construction-boq.jpg</image:loc>
      <image:title>Construction BoQ Progress Billing</image:title>
    </image:image>
    <image:image>
      <image:loc>https://sgctech.ai/static/stories/logistics-warehouse.jpg</image:loc>
      <image:title>Logistics Warehouse Customs</image:title>
    </image:image>
    <image:image>
      <image:loc>https://sgctech.ai/static/stories/realestate-crm.jpg</image:loc>
      <image:title>Real Estate Property CRM</image:title>
    </image:image>
    <image:image>
      <image:loc>https://sgctech.ai/static/stories/education-lms.jpg</image:loc>
      <image:title>Education LMS Live Classrooms</image:title>
    </image:image>
    <image:image>
      <image:loc>https://sgctech.ai/static/stories/hospitality-hotel.jpg</image:loc>
      <image:title>Hospitality Hotel PMS</image:title>
    </image:image>
  </url>

  <!-- Why SGC Tech AI Section -->
  <url>
    <loc>https://sgctech.ai/#why</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>

  <!-- Pricing Section -->
  <url>
    <loc>https://sgctech.ai/#pricing</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.90</priority>
  </url>

  <!-- Testimonials/Customers Section -->
  <url>
    <loc>https://sgctech.ai/#testimonials</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>

  <!-- Case Studies/Stories Section -->
  <url>
    <loc>https://sgctech.ai/#stories</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>

  <!-- FAQ Section -->
  <url>
    <loc>https://sgctech.ai/#faq</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>

  <!-- Legal Pages -->
  <url>
    <loc>https://sgctech.ai/privacy</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.40</priority>
  </url>

  <url>
    <loc>https://sgctech.ai/terms</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.40</priority>
  </url>

  <url>
    <loc>https://sgctech.ai/security</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.40</priority>
  </url>

</urlset>`)
})

app.get('/robots.txt', (c) => {
  c.header('Content-Type', 'text/plain; charset=utf-8')
  return c.text(`# robots.txt - SGC Tech AI
# Search engine crawler directives

# Allow all crawlers to index the site
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Point to sitemap
Sitemap: https://sgctech.ai/sitemap.xml

# Crawl delay (in seconds)
Crawl-delay: 1
`)
})

/* ---------- Legal Pages ---------- */

app.get('/terms', (c) => {
  return c.render(
    <main style="padding: 2rem 1.2rem; max-width: 900px; margin: 0 auto;">
      <header style="margin-bottom: 2rem;">
        <a href="/" style="display: inline-block; margin-bottom: 1rem; color: var(--cyan); text-decoration: none;">← Back to home</a>
        <h1>Terms of Service</h1>
        <p style="color: var(--gray-300); font-size: 0.9rem;">Last updated: April 23, 2026</p>
      </header>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using sgctech.ai (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on sgctech.ai for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
          <li>Attempt to decompile or reverse engineer any software contained on sgctech.ai</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          <li>Violate any applicable laws or regulations related to access to or use of sgctech.ai</li>
        </ul>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>3. Disclaimer</h2>
        <p>The materials on sgctech.ai are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>4. Limitations</h2>
        <p>In no event shall sgctech.ai or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on sgctech.ai, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.</p>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>5. Accuracy of Materials</h2>
        <p>The materials appearing on sgctech.ai could include technical, typographical, or photographic errors. We do not warrant that any of the materials on sgctech.ai are accurate, complete, or current. We may make changes to the materials contained on sgctech.ai at any time without notice.</p>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>6. Links</h2>
        <p>We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.</p>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>7. Modifications</h2>
        <p>We may revise these terms of service for sgctech.ai at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>8. Governing Law</h2>
        <p>These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 3rem;">
        <h2>9. Contact</h2>
        <p>If you have any questions about these Terms of Service, please contact us at <strong>legal@sgctech.ai</strong></p>
      </section>
    </main>
  )
})

app.get('/privacy', (c) => {
  return c.render(
    <main style="padding: 2rem 1.2rem; max-width: 900px; margin: 0 auto;">
      <header style="margin-bottom: 2rem;">
        <a href="/" style="display: inline-block; margin-bottom: 1rem; color: var(--cyan); text-decoration: none;">← Back to home</a>
        <h1>Privacy Policy</h1>
        <p style="color: var(--gray-300); font-size: 0.9rem;">Last updated: April 23, 2026</p>
      </header>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>1. Introduction</h2>
        <p>SGC Tech AI ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website sgctech.ai (the "Site").</p>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>2. Information We Collect</h2>
        <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
          <li><strong>Personal Data:</strong> Name, email address, phone number, company name, and job title when you submit forms or contact us</li>
          <li><strong>Usage Data:</strong> Information about how you interact with our Site, including pages visited, time spent, and links clicked</li>
          <li><strong>Device Data:</strong> Information about your browser, device type, operating system, and IP address</li>
          <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience</li>
        </ul>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>3. Use of Your Information</h2>
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
          <li>Respond to your inquiries and fulfill requests</li>
          <li>Send promotional and marketing communications (with your consent)</li>
          <li>Improve and optimize our Site and services</li>
          <li>Analyze usage trends and gather demographic information</li>
          <li>Comply with legal obligations</li>
          <li>Prevent fraud and enhance security</li>
        </ul>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>4. Disclosure of Your Information</h2>
        <p>We may share information we have collected about you in certain situations:</p>
        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
          <li><strong>Service Providers:</strong> We may share your information with third parties that perform services on our behalf</li>
          <li><strong>Legal Requirements:</strong> We may disclose your information where required by law</li>
          <li><strong>Business Transfers:</strong> Your information may be transferred as part of a merger, acquisition, or sale of assets</li>
          <li><strong>Your Consent:</strong> We may disclose your information with your explicit consent</li>
        </ul>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>5. Security of Your Information</h2>
        <p>We use administrative, technical, and physical security measures to protect your personal information. These include encryption, firewalls, and secure server protocols. However, no method of transmission over the Internet is 100% secure.</p>
        <p style="margin-top: 1rem;"><strong>Our Security Certifications:</strong></p>
        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
          <li>SOC 2 Type II Compliant</li>
          <li>GDPR Compliant</li>
          <li>HIPAA Eligible (for healthcare customers)</li>
          <li>ISO 27001 Certified</li>
        </ul>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>6. Contact Information</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p style="margin-top: 1rem;">
          <strong>Email:</strong> privacy@sgctech.ai<br/>
          <strong>Address:</strong> SGC Tech AI<br/>
          <strong>Response time:</strong> Within 48 hours
        </p>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 3rem;">
        <h2>7. GDPR & Data Subject Rights</h2>
        <p>If you are an EU resident, you have the right to:</p>
        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
          <li>Access your personal data</li>
          <li>Rectify inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Restrict processing</li>
          <li>Data portability</li>
          <li>Withdraw consent</li>
        </ul>
        <p style="margin-top: 1rem;">To exercise these rights, please contact us at privacy@sgctech.ai</p>
      </section>
    </main>
  )
})

app.get('/security', (c) => {
  return c.render(
    <main style="padding: 2rem 1.2rem; max-width: 900px; margin: 0 auto;">
      <header style="margin-bottom: 2rem;">
        <a href="/" style="display: inline-block; margin-bottom: 1rem; color: var(--cyan); text-decoration: none;">← Back to home</a>
        <h1>Security & Compliance</h1>
        <p style="color: var(--gray-300); font-size: 0.9rem;">Last updated: April 23, 2026</p>
      </header>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>Enterprise-Grade Security</h2>
        <p>SGC Tech AI is built for regulated enterprises. Security and compliance are baked into every layer of our platform — from infrastructure to API design to data handling.</p>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>Certifications & Compliance</h2>
        <div style="display: grid; gap: 1rem;">
          <div>
            <h3 style="margin: 0 0 0.5rem 0; color: var(--cyan);">SOC 2 Type II</h3>
            <p style="margin: 0;">Independently audited. Demonstrates controls over security, availability, processing integrity, confidentiality, and privacy.</p>
          </div>
          <div>
            <h3 style="margin: 0 0 0.5rem 0; color: var(--cyan);">GDPR Compliant</h3>
            <p style="margin: 0;">Full compliance with EU data protection regulation. Data residency controls, DPA framework, and DPIA support included.</p>
          </div>
          <div>
            <h3 style="margin: 0 0 0.5rem 0; color: var(--cyan);">HIPAA Eligible</h3>
            <p style="margin: 0;">For healthcare customers. BAA available. Encryption at rest and in transit. Audit logs and access controls.</p>
          </div>
          <div>
            <h3 style="margin: 0 0 0.5rem 0; color: var(--cyan);">ISO 27001</h3>
            <p style="margin: 0;">Information security management system certified. Covers access controls, incident management, and risk assessment.</p>
          </div>
        </div>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>Data Protection</h2>
        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
          <li><strong>Encryption at Rest:</strong> AES-256 encryption for all stored data</li>
          <li><strong>Encryption in Transit:</strong> TLS 1.3 for all data transfers</li>
          <li><strong>Key Management:</strong> Cloudflare Key Management Service (KMS)</li>
          <li><strong>Data Residency:</strong> EU, US, and APAC region options</li>
          <li><strong>Backup & Recovery:</strong> Automated daily backups, 90-day retention</li>
        </ul>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>Access Controls</h2>
        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
          <li><strong>Role-Based Access Control (RBAC):</strong> Admin, operator, viewer, and custom roles</li>
          <li><strong>Multi-Factor Authentication (MFA):</strong> Mandatory for all production accounts</li>
          <li><strong>Session Management:</strong> Automatic logout after 30 minutes of inactivity</li>
          <li><strong>Audit Logging:</strong> All access logged with timestamps and IP addresses</li>
          <li><strong>Single Sign-On (SSO):</strong> SAML 2.0 and OAuth 2.0 support</li>
        </ul>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>Infrastructure Security</h2>
        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
          <li><strong>Cloud Provider:</strong> Cloudflare Workers + Cloudflare Pages (SOC 2 certified)</li>
          <li><strong>DDoS Protection:</strong> Automatic DDoS mitigation at edge</li>
          <li><strong>WAF Rules:</strong> OWASP Top 10 protection enabled</li>
          <li><strong>API Security:</strong> Rate limiting, JWT validation, CORS enforcement</li>
          <li><strong>CDN:</strong> Global edge caching with automatic failover</li>
        </ul>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>Incident Response</h2>
        <p><strong>Response Time:</strong> Critical incidents acknowledged within 1 hour, updates every 4 hours</p>
        <p style="margin-top: 0.5rem;"><strong>Process:</strong></p>
        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
          <li>24/7 security monitoring</li>
          <li>Incident triage and severity classification</li>
          <li>Customer notification within SLA timeframe</li>
          <li>Post-incident review and remediation</li>
          <li>Regular security drills</li>
        </ul>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>Vulnerability Management</h2>
        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
          <li><strong>Regular Scans:</strong> Automated vulnerability scanning (OWASP ZAP, Nessus)</li>
          <li><strong>Penetration Testing:</strong> Third-party pen tests quarterly</li>
          <li><strong>Security Updates:</strong> Patches deployed within 24-48 hours of disclosure</li>
          <li><strong>Responsible Disclosure:</strong> Bug bounty program available (contact security@sgctech.ai)</li>
        </ul>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>Uptime & SLA</h2>
        <p><strong>Guaranteed Uptime:</strong> 99.9% (3 nines) for production environments</p>
        <p style="margin-top: 0.5rem;"><strong>SLA Terms:</strong></p>
        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
          <li>99.9% - 0.1% credit applied to next month</li>
          <li>99.0% - 1% credit applied to next month</li>
          <li>Below 99.0% - 10% credit applied to next month</li>
        </ul>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h2>Contact Security</h2>
        <p>For security concerns or to report a vulnerability:</p>
        <p style="margin-top: 1rem;">
          <strong>Email:</strong> security@sgctech.ai<br/>
          <strong>Response time:</strong> Within 24 hours<br/>
          <strong>Bug Bounty:</strong> Available for verified security researchers
        </p>
      </section>

      <section class="glass" style="padding: 1.5rem; border-radius: 12px; margin-bottom: 3rem;">
        <h2>Request Our SOC 2 Report</h2>
        <p>Customers and prospects can request our latest SOC 2 Type II audit report. This is typically provided under NDA.</p>
        <p style="margin-top: 1rem;"><a href="https://app.cal.com/sgctech" style="color: var(--cyan); text-decoration: none;">Schedule a compliance review call →</a></p>
      </section>
    </main>
  )
})

export default app
