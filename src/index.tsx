import { Hono } from 'hono'
import { renderer } from './renderer'
import {
  IconArrow, IconCheck, IconX, IconPlus, IconStar, IconMenu,
  IconHealthcare, IconFinance, IconRetail, IconManufacturing,
  IconLogistics, IconEducation, IconLegal, IconRealestate,
  IconSpeed, IconShield, IconIntegration, IconCpu, IconChart, IconHeadset,
  IconTwitter, IconLinkedin, IconGithub, IconYoutube,
} from './components/Icons'
import { AwardBadges } from './components/AwardBadges'
import { CircuitBg } from './components/CircuitBg'

const app = new Hono()

app.use(renderer)

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

const values = [
  { num: '01', title: '14-Day Deployment', text: 'From kick-off to production in two weeks. No six-month pilots. Fixed scope, fixed price.', Icon: IconSpeed },
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
    cta: 'Start 14-day trial',
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
    quote: 'We deployed in 11 days — not 14. The route-optimization agent saved us $340k in the first quarter. Our ops team calls it the hardest-working employee they\'ve ever hired.',
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
    q: 'What does "14-day deployment" actually mean?',
    a: 'From the signed order form to a live, production workflow handling real traffic — fourteen business days. We scope narrowly, implement surgically, and deliver measurable outcomes. Deployments extending beyond 14 days receive a 25% service credit.',
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
    a: 'Yes. Our 14-day trial on the Starter plan is a full production pilot — not a sandbox demo. You get real agents, real integrations, and real outcomes with no long-term commitment.',
  },
]

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
          </ul>
          <div class="nav-cta">
            <a href="https://scholarixglobal.com/web/login" class="btn btn-ghost" style="padding: 0.55rem 1.1rem;" target="_blank" rel="noopener noreferrer">Sign in</a>
            <a href="#pricing" class="btn btn-primary" style="padding: 0.55rem 1.1rem;" data-magnetic>
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
                  <span>Production AI · Deployed in 14 Days</span>
                </div>

                <h1 class="reveal reveal-delay-1">
                  Enterprise AI,<br />
                  without the <span class="highlight text-gradient-cyan">18-month</span><br />
                  consulting project.
                </h1>

                <p class="hero-lead reveal reveal-delay-2">
                  SGC TECH AI ships production-grade agents, integrations, and
                  workflows for regulated businesses — fixed scope, fixed price,
                  fourteen business days. Then we measure the ROI, together.
                </p>

                <div class="hero-ctas reveal reveal-delay-3">
                  <a href="#pricing" class="btn btn-primary btn-lg" data-magnetic>
                    Start 14-day trial <IconArrow />
                  </a>
                  <a href="#why" class="btn btn-ghost btn-lg">
                    See how it works
                  </a>
                </div>

                <AwardBadges />

                <div class="hero-stats reveal reveal-delay-4">
                  <div>
                    <div class="stat-value"><span data-count="14" data-suffix="">0</span></div>
                    <div class="stat-label">Day deployment</div>
                  </div>
                  <div>
                    <div class="stat-value"><span data-count="200" data-suffix="+">0</span></div>
                    <div class="stat-label">Integrations</div>
                  </div>
                  <div>
                    <div class="stat-value"><span data-count="99.99" data-suffix="%">0</span></div>
                    <div class="stat-label">Uptime SLA</div>
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
              Powering AI teams at <span style="color: var(--cyan);">500+ companies</span> worldwide
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
        <section id="industries">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-label">01 · Industries</span>
              <h2>Built for the industries <span class="text-gradient-cyan">most allergic</span> to AI hype.</h2>
              <p class="lead">We specialize in compliance-heavy, revenue-critical workflows where "move fast and break things" is a career-ending strategy.</p>
            </div>

            <div class="industries-grid">
              {industries.map((ind, i) => (
                <article class={`glass industry-card ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'}`} style={`transition-delay: ${(i % 4) * 70}ms`}>
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
        <section id="why">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-label">02 · Why SGC TECH AI</span>
              <h2>Six reasons our customers <br /><span class="text-gradient-cyan">don't renew</span> — they expand.</h2>
              <p class="lead">Average net-revenue retention sits at 143%. That's not a marketing number. That's what happens when the product actually works.</p>
            </div>

            <div class="values-grid">
              {values.map((v, i) => (
                <article class="glass value-card reveal-scale" data-holo style={`transition-delay: ${(i % 3) * 80}ms`}>
                  <div class="num">{v.num}</div>
                  <div class="icon-ring"><v.Icon /></div>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============== PRICING ============== */}
        <section id="pricing">
          <div class="container">
            <div class="section-header center reveal">
              <span class="section-label">03 · Pricing</span>
              <h2>Fixed-price tiers.<br /><span class="text-gradient-cyan">No "contact us" games</span> for the first two.</h2>
              <p class="lead" style="margin-left: auto; margin-right: auto;">Transparent pricing because enterprise software shouldn't feel like buying a used car.</p>
            </div>

            <div class="pricing-grid">
              {pricing.map((p, i) => (
                <article class={`glass pricing-card reveal-scale ${p.featured ? 'featured' : ''}`} style={`transition-delay: ${i * 90}ms`}>
                  {p.featured && <span class="pricing-tag">Most Popular</span>}
                  <div class="pricing-tier">{p.tier}</div>

                  <div class="pricing-price">
                    {p.price === 'Custom' ? (
                      <span class="amount">Custom</span>
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

                  <a href="#contact" class={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'}`} data-magnetic>
                    {p.cta} <IconArrow />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============== TESTIMONIALS ============== */}
        <section id="testimonials">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-label">04 · Customers</span>
              <h2>What the people <span class="text-gradient-cyan">actually writing checks</span> say.</h2>
              <p class="lead">Verified quotes from active customers. LinkedIn-checkable. Case studies available under NDA.</p>
            </div>

            <div class="testimonials-grid">
              {testimonials.map((t, i) => (
                <article class={`glass testimonial-card ${i === 1 ? 'reveal' : i === 0 ? 'reveal-left' : 'reveal-right'}`} style={`transition-delay: ${i * 100}ms`}>
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
        </section>

        {/* ============== CUSTOMER SUCCESS STORIES (CARD STACK) ============== */}
        <section class="stories-section" id="stories">
          <div class="container">
            <div class="section-header center reveal">
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
        <section id="faq">
          <div class="container">
            <div class="section-header center reveal">
              <span class="section-label">06 · FAQ</span>
              <h2>The answers <span class="text-gradient-cyan">before you ask.</span></h2>
            </div>

            <div class="faq-wrap">
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
            <div class="cta-card reveal">
              <div class="cta-grid">
                <div>
                  <span class="section-label">Ready when you are</span>
                  <h2>Fourteen days from now,<br />your AI is <span class="text-gradient-cyan">already shipping value.</span></h2>
                  <p class="lead">Book a 30-minute scoping call. We'll walk through your highest-leverage workflow and show you exactly what week one through fourteen looks like.</p>
                </div>
                <div class="cta-buttons">
                  <a href="#" class="btn btn-primary" data-magnetic>
                    Book a 30-min call <IconArrow />
                  </a>
                  <a href="#pricing" class="btn btn-ghost">
                    Start 14-day trial
                  </a>
                  <p class="cta-note">No credit card · Cancel anytime</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============== FOOTER ============== */}
      <footer>
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a href="#top" class="nav-logo">
                <img src="/static/sgc-tech-logo.png" alt="SGC TECH AI" style="width: 44px; height: 44px;" />
                <span>SGC <span style="color: var(--cyan)">TECH</span></span>
              </a>
              <p>Production AI for regulated enterprises. Fixed scope, fixed price, fourteen business days — from handshake to live traffic.</p>
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

export default app
