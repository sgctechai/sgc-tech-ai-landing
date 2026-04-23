import { Hono } from 'hono'
import { renderer } from '../renderer'
import { INDUSTRIES, AI_FEATURES, ODOO_MODULES } from '../data/quote-data'

const quoteBuilderApp = new Hono()

quoteBuilderApp.use(renderer)

// Inline SVG icons keyed by our icon identifiers
const QbIcons: Record<string, string> = {
  building:    `<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/>`,
  landmark:    `<path d="M3 22V12h18v10M2 12l10-9 10 9M12 7v5"/>`,
  heart:       `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`,
  'shopping-bag': `<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>`,
  factory:     `<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16z"/>`,
  truck:       `<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>`,
  book:        `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>`,
  hammer:      `<path d="M13 2l-9 9 5 5 9-9-5-5z"/><path d="M14 13l6 6"/>`,
  utensils:    `<line x1="18" y1="2" x2="18" y2="22"/><path d="M10 2v5a4 4 0 0 0 4 4H6a4 4 0 0 0 4-4V2z"/><line x1="10" y1="11" x2="10" y2="22"/>`,
  scale:       `<line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
  message:     `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
  share:       `<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>`,
  workflow:    `<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><path d="M6 9v3a3 3 0 0 0 3 3h.5M18 9v3a3 3 0 0 1-3 3h-.5"/>`,
  headset:     `<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>`,
  target:      `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,
  phone:       `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.09 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17l.92-.08z"/>`,
  shield:      `<path d="M12 2L3 5v7c0 5 3.5 9 9 10 5.5-1 9-5 9-10V5z"/>`,
  chart:       `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
  eye:         `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`,
  briefcase:   `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>`,
  calculator:  `<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>`,
  box:         `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`,
  users:       `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  trophy:      `<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>`,
  kanban:      `<rect x="3" y="3" width="6" height="18" rx="1"/><rect x="11" y="3" width="6" height="12" rx="1"/><rect x="19" y="3" width="2" height="8" rx="1"/>`,
  cart:        `<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>`,
  bed:         `<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>`,
  file:        `<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>`,
  card:        `<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>`,
  mail:        `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`,
  check:       `<polyline points="20 6 9 17 4 12"/>`,
  download:    `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`,
  x:           `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
  info:        `<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`,
}

const QbIcon = ({ name, size = 18 }: { name: string; size?: number }) => {
  const paths = QbIcons[name] ?? QbIcons['info']
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true" innerHTML={paths} />
  )
}

const fmt = (n: number) => `AED ${n.toLocaleString('en-AE')}`

const tierLabel: Record<string, string> = {
  basic: 'Tier 1 — Basic',
  advanced: 'Tier 2 — Advanced',
  specialized: 'Tier 3 — Specialized',
}

quoteBuilderApp.get('/', async (c) => {
  // Group AI features by tier, modules by category
  const aiByTier: Record<string, typeof AI_FEATURES> = {}
  for (const f of AI_FEATURES) {
    if (!aiByTier[f.tier]) aiByTier[f.tier] = []
    aiByTier[f.tier].push(f)
  }

  const modByCategory: Record<string, typeof ODOO_MODULES> = {}
  for (const m of ODOO_MODULES) {
    if (!modByCategory[m.category]) modByCategory[m.category] = []
    modByCategory[m.category].push(m)
  }

  return c.render(
    <main class="qb-page">
      {/* ── Header ── */}
      <section class="qb-hero">
        <p class="qb-hero-badge"><QbIcon name="chart" size={14} /> Interactive Quote Builder</p>
        <h1 class="qb-hero-title">Build Your Custom <span class="text-gradient-cyan">Implementation Package</span></h1>
        <p class="qb-hero-sub">Transparent pricing. Zero surprises. <strong>30-day deployment.</strong></p>
      </section>

      {/* ── Step 1: Industry ── */}
      <section class="qb-step" id="qb-step-industry">
        <div class="qb-step-header">
          <span class="qb-step-num">01</span>
          <h2 class="qb-step-title">Select Your Industry</h2>
        </div>
        <div class="qb-industries" id="qb-industries">
          {INDUSTRIES.map(ind => (
            <button
              class="qb-industry-card glass"
              data-industry-id={ind.id}
              data-base-cost={ind.baseCost}
              data-avg-days={ind.avgDeploymentDays}
              data-proof-title={ind.proofPoint.title}
              data-proof-metric={ind.proofPoint.metric}
              data-recommended-ai={ind.recommendedAiFeatures.join(',')}
              data-recommended-mod={ind.recommendedModules.join(',')}
              type="button"
              aria-pressed="false"
            >
              <span class="qb-ind-icon"><QbIcon name={ind.icon} size={24} /></span>
              <span class="qb-ind-name">{ind.name}</span>
              <span class="qb-ind-cost">{fmt(ind.baseCost)}</span>
              <span class="qb-ind-days">{ind.avgDeploymentDays} days</span>
              <span class="qb-ind-proof">{ind.proofPoint.metric}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Steps 2+3 (hidden until industry selected) ── */}
      <div id="qb-builder" class="qb-builder" hidden>

        {/* Selected industry context bar */}
        <div class="qb-context-bar glass" id="qb-context-bar">
          <span id="qb-context-industry" class="qb-context-name"></span>
          <span class="qb-context-sep">·</span>
          <span id="qb-context-days" class="qb-context-days"></span>
          <span class="qb-context-sep">·</span>
          <span id="qb-context-proof" class="qb-context-proof"></span>
        </div>

        {/* ── Step 2: Features ── */}
        <section class="qb-step">
          <div class="qb-step-header">
            <span class="qb-step-num">02</span>
            <h2 class="qb-step-title">Choose Features &amp; Modules</h2>
            <p class="qb-step-sub">Select any combination — pricing updates in real time.</p>
          </div>

          <div class="qb-columns">
            {/* Left: AI Features */}
            <div class="qb-feature-col">
              <div class="qb-col-header">
                <QbIcon name="chart" size={16} />
                <span>AI Features <em class="qb-optional">(Optional)</em></span>
              </div>
              {(['basic', 'advanced', 'specialized'] as const).map(tier => (
                <div class="qb-tier-group">
                  <div class="qb-tier-label">{tierLabel[tier]}</div>
                  {aiByTier[tier]?.map(f => (
                    <label class="qb-checkbox-item" data-feature-type="ai">
                      <input
                        type="checkbox"
                        class="qb-cb"
                        data-feature-id={f.id}
                        data-cost={f.cost}
                        data-feature-kind="ai"
                        id={`ai-${f.id}`}
                      />
                      <span class="qb-cb-box"></span>
                      <span class="qb-item-body">
                        <span class="qb-item-name">{f.name}</span>
                        <span class="qb-item-desc">{f.description}</span>
                        <span class="qb-item-price">{fmt(f.cost)}</span>
                      </span>
                    </label>
                  ))}
                </div>
              ))}
            </div>

            {/* Right: ERP Modules */}
            <div class="qb-feature-col">
              <div class="qb-col-header">
                <QbIcon name="box" size={16} />
                <span>Odoo ERP Modules</span>
              </div>
              {(['core', 'advanced', 'integration'] as const).map(cat => (
                <div class="qb-tier-group">
                  <div class="qb-tier-label">{cat.charAt(0).toUpperCase() + cat.slice(1)} Modules</div>
                  {modByCategory[cat]?.map(m => (
                    <label class="qb-checkbox-item" data-feature-type="module">
                      <input
                        type="checkbox"
                        class="qb-cb"
                        data-feature-id={m.id}
                        data-cost={m.cost}
                        data-feature-kind="module"
                        id={`mod-${m.id}`}
                      />
                      <span class="qb-cb-box"></span>
                      <span class="qb-item-body">
                        <span class="qb-item-name">{m.name}</span>
                        <span class="qb-item-desc">{m.description}</span>
                        <span class="qb-item-price">{fmt(m.cost)}</span>
                      </span>
                    </label>
                  ))}
                </div>
              ))}
            </div>

            {/* Sidebar: Pricing Summary */}
            <aside class="qb-sidebar" id="qb-sidebar">
              <div class="qb-sidebar-inner glass">
                <h3 class="qb-sidebar-title">Pricing Summary</h3>

                <div class="qb-price-rows">
                  <div class="qb-price-row">
                    <span>Base Implementation</span>
                    <span id="qb-base-cost" class="qb-price-val">—</span>
                  </div>
                  <div class="qb-price-row">
                    <span>AI Features</span>
                    <span id="qb-ai-cost" class="qb-price-val">AED 0</span>
                  </div>
                  <div class="qb-price-row">
                    <span>ERP Modules</span>
                    <span id="qb-mod-cost" class="qb-price-val">AED 0</span>
                  </div>
                  <div class="qb-price-row">
                    <span>Implementation Support</span>
                    <span id="qb-support-cost" class="qb-price-val">—</span>
                  </div>
                  <div class="qb-price-row" id="qb-retainer-row" style="display:none">
                    <span>Operations Retainer</span>
                    <span class="qb-price-val">AED 8,000</span>
                  </div>
                  <div class="qb-price-divider"></div>
                  <div class="qb-price-row qb-subtotal-row">
                    <span>Subtotal</span>
                    <span id="qb-subtotal" class="qb-price-val">—</span>
                  </div>
                  <div class="qb-price-row qb-vat-row">
                    <span>VAT (5%)</span>
                    <span id="qb-vat" class="qb-price-val">—</span>
                  </div>
                  <div class="qb-price-row qb-total-row">
                    <span>TOTAL</span>
                    <span id="qb-total" class="qb-total-val">—</span>
                  </div>
                </div>

                {/* Timeline */}
                <div class="qb-timeline">
                  <div class="qb-timeline-title">Estimated Timeline</div>
                  <div class="qb-timeline-steps">
                    <div class="qb-tl-step">
                      <span class="qb-tl-dot">1</span>
                      <div><strong>Week 1–2</strong><br /><small>Discovery &amp; config</small></div>
                    </div>
                    <div class="qb-tl-step">
                      <span class="qb-tl-dot">2</span>
                      <div><strong>Week 3</strong><br /><small>Testing &amp; UAT</small></div>
                    </div>
                    <div class="qb-tl-step qb-tl-golive">
                      <span class="qb-tl-dot">✓</span>
                      <div>
                        <strong>Day <span id="qb-days">—</span>: Go-Live</strong>
                        <br /><small id="qb-golive-date">—</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Retainer Toggle */}
                <label class="qb-retainer-toggle">
                  <input type="checkbox" id="qb-retainer-cb" />
                  <span class="qb-cb-box"></span>
                  <span>
                    <strong>90-Day Operations Retainer</strong>
                    <small>AED 8,000 · 24/7 priority support</small>
                  </span>
                </label>

                {/* CTA */}
                <button class="btn btn-primary qb-pdf-btn" id="qb-pdf-btn" type="button">
                  <QbIcon name="download" size={16} />
                  Generate PDF Proposal
                </button>
                <p class="qb-sidebar-note">Enter your details to personalise the proposal</p>
              </div>
            </aside>
          </div>
        </section>
      </div>{/* /qb-builder */}

      {/* ── Lead Capture Modal ── */}
      <div class="qb-modal-overlay" id="qb-modal" aria-modal="true" role="dialog" aria-labelledby="qb-modal-title" hidden>
        <div class="qb-modal-card glass">
          <button class="qb-modal-close" id="qb-modal-close" type="button" aria-label="Close"><QbIcon name="x" size={18} /></button>
          <h3 class="qb-modal-title" id="qb-modal-title">Get Your Quote</h3>
          <p class="qb-modal-sub">Enter your details to download or email your personalised proposal.</p>

          {/* Honeypot — hidden from humans, bots fill it */}
          <div style="display:none;position:absolute;left:-9999px;" aria-hidden="true">
            <input type="text" id="qb-hp" name="website" tabindex={-1} autocomplete="off" />
          </div>

          <div class="qb-field">
            <label for="qb-company">Company Name <span class="qb-required">*</span></label>
            <input type="text" id="qb-company" placeholder="e.g. Meridian Holdings" autocomplete="organization" />
          </div>
          <div class="qb-field">
            <label for="qb-email">Work Email <span class="qb-required">*</span></label>
            <div class="qb-email-wrap">
              <input type="email" id="qb-email" placeholder="you@company.com" autocomplete="email" />
              <span id="qb-email-status" class="qb-email-status" aria-live="polite"></span>
            </div>
          </div>
          <div class="qb-field">
            <label for="qb-mobile">Mobile <span class="qb-required">*</span></label>
            <input type="tel" id="qb-mobile" placeholder="+971 50 123 4567" autocomplete="tel" />
          </div>

          <div id="qb-modal-error" class="qb-modal-error" hidden></div>
          <div id="qb-email-success" class="qb-email-success" hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Quote sent! Check your inbox (and spam folder just in case).
          </div>

          <div class="qb-modal-actions">
            <button class="btn btn-ghost" id="qb-modal-cancel" type="button">Cancel</button>
            <button class="btn btn-secondary" id="qb-modal-download" type="button">
              <QbIcon name="download" size={16} />
              Download PDF
            </button>
            <button class="btn btn-primary" id="qb-modal-email" type="button">
              <QbIcon name="mail" size={16} />
              Email Me This Quote
            </button>
          </div>
        </div>
      </div>

      {/* Embed data as a hidden element's data attribute — Hono JSX innerHTML on <script> renders as an attribute, not content */}
      <div id="qb-data" style="display:none" data-json={JSON.stringify({
        industries: INDUSTRIES,
        aiFeatures: AI_FEATURES,
        odooModules: ODOO_MODULES,
      })}></div>
      {/* jsPDF + autoTable loaded only on this page */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" defer></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js" defer></script>
      <script src="/static/quote-builder.js" defer></script>
    </main>
  )
})

export default quoteBuilderApp
