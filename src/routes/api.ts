import { Hono } from 'hono'
import { validateEmail, VALIDATION_MESSAGES } from '../utils/email-validator'
import { sendEmail, SmtpConfig } from '../utils/smtp'
import { createOdooLead } from '../utils/odoo'
import { buildCustomerEmailHtml, buildNotificationEmailHtml } from '../utils/email-templates'
import { INDUSTRIES, AI_FEATURES, ODOO_MODULES } from '../data/quote-data'

const api = new Hono()

/* ── Helpers ─────────────────────────────────────────────────────── */

function getSmtpConfig(env: Record<string, string>): SmtpConfig {
  return {
    host: 'smtppro.zoho.com',
    port: 465,
    user: 'hello@scholarixglobal.com',
    pass: env.SMTP_PASS || '',
    fromName: 'SGC TECH AI',
  }
}

async function rateLimitKv(
  kv: KVNamespace,
  key: string,
  windowSec: number,
  maxHits: number
): Promise<boolean> {
  const raw = await kv.get(key)
  const count = raw ? parseInt(raw, 10) : 0
  if (count >= maxHits) return false
  await kv.put(key, String(count + 1), { expirationTtl: windowSec })
  return true
}

function serverRecomputeQuote(
  industryId: string,
  aiFeatureIds: string[],
  moduleIds: string[],
  includeRetainer: boolean
) {
  const ind = INDUSTRIES.find(i => i.id === industryId)
  if (!ind) return null

  const aiCost = aiFeatureIds.reduce((s, id) => {
    const f = AI_FEATURES.find(f => f.id === id)
    return s + (f ? f.cost : 0)
  }, 0)

  const modCost = moduleIds.reduce((s, id) => {
    const m = ODOO_MODULES.find(m => m.id === id)
    return s + (m ? m.cost : 0)
  }, 0)

  const totalSel = aiFeatureIds.length + moduleIds.length
  const days = Math.ceil(ind.avgDeploymentDays * (1 + (totalSel / 10) * 0.15))
  const supportCost = days * 800
  const retainerCost = includeRetainer ? 8000 : 0
  const subtotal = ind.baseCost + aiCost + modCost + supportCost + retainerCost
  const vat = Math.round(subtotal * 0.05)
  const total = subtotal + vat

  const goLive = new Date()
  goLive.setDate(goLive.getDate() + days)

  const aiFeatureNames = aiFeatureIds
    .map(id => AI_FEATURES.find(f => f.id === id)?.name)
    .filter(Boolean) as string[]

  const moduleNames = moduleIds
    .map(id => ODOO_MODULES.find(m => m.id === id)?.name)
    .filter(Boolean) as string[]

  return {
    industry: ind,
    aiCost, modCost, supportCost, retainerCost,
    subtotal, vat, total, days,
    goLiveDate: goLive.toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' }),
    aiFeatureNames,
    moduleNames,
  }
}

/* ── POST /api/validate-email ────────────────────────────────────── */
api.post('/validate-email', async (c) => {
  const env = c.env as Record<string, string> & { AIRA_BRAIN_KV: KVNamespace }
  const ip = c.req.header('CF-Connecting-IP') || 'unknown'

  const allowed = await rateLimitKv(env.AIRA_BRAIN_KV, `rl:ve:${ip}`, 60, 10)
  if (!allowed) {
    return c.json({ valid: false, reason: 'rate_limited', message: 'Too many requests. Please wait a moment.' }, 429)
  }

  let body: { email?: string }
  try { body = await c.req.json() } catch { return c.json({ valid: false, message: 'Invalid request body' }, 400) }

  const { email } = body
  if (!email || typeof email !== 'string') {
    return c.json({ valid: false, message: 'Email is required' }, 400)
  }

  const result = validateEmail(email.trim())
  if (!result.valid) {
    return c.json({ valid: false, message: VALIDATION_MESSAGES[(result as { valid: false; reason: string }).reason] || 'Invalid email.' })
  }

  // Issue a short-lived token after successful validation
  const token = crypto.randomUUID()
  await env.AIRA_BRAIN_KV.put(`qt:${token}`, email.trim().toLowerCase(), { expirationTtl: 600 })

  return c.json({ valid: true, token })
})

/* ── POST /api/send-quote ────────────────────────────────────────── */
api.post('/send-quote', async (c) => {
  const env = c.env as Record<string, string> & { AIRA_BRAIN_KV: KVNamespace }
  const ip = c.req.header('CF-Connecting-IP') || 'unknown'

  const allowed = await rateLimitKv(env.AIRA_BRAIN_KV, `rl:sq:${ip}`, 60, 3)
  if (!allowed) {
    return c.json({ success: false, message: 'Too many requests. Please try again shortly.' }, 429)
  }

  let body: {
    company?: string; email?: string; mobile?: string; _hp?: string
    industryId?: string; aiFeatureIds?: string[]; moduleIds?: string[]
    includeRetainer?: boolean; token?: string
  }
  try { body = await c.req.json() } catch { return c.json({ success: false, message: 'Invalid request' }, 400) }

  // Honeypot — bots fill this hidden field
  if (body._hp) return c.json({ success: false, message: 'Invalid submission' }, 400)

  const { company, email, mobile, industryId, aiFeatureIds = [], moduleIds = [], includeRetainer = false, token } = body

  // Validate required fields
  if (!company?.trim() || !email?.trim() || !mobile?.trim() || !industryId) {
    return c.json({ success: false, message: 'Company, email, mobile and industry are required.' }, 400)
  }

  // Verify token (issued by /validate-email)
  if (!token) return c.json({ success: false, message: 'Email verification required.' }, 400)
  const tokenEmail = await env.AIRA_BRAIN_KV.get(`qt:${token}`)
  if (!tokenEmail || tokenEmail !== email.trim().toLowerCase()) {
    // Re-validate server-side as fallback (token may have expired)
    const recheck = validateEmail(email.trim())
    if (!recheck.valid) {
      return c.json({ success: false, message: VALIDATION_MESSAGES[(recheck as { valid: false; reason: string }).reason] || 'Invalid email.' }, 400)
    }
  }

  // Server-side pricing recompute (never trust client totals)
  const quote = serverRecomputeQuote(industryId, aiFeatureIds, moduleIds, includeRetainer)
  if (!quote) return c.json({ success: false, message: 'Invalid industry selection.' }, 400)

  const quoteNumber = 'SGC-' + Date.now().toString().slice(-6)
  const smtp = getSmtpConfig(env)
  const notificationEmail = env.NOTIFICATION_EMAIL || 'info@sgctech.ai'

  // Send customer email
  const customerHtml = buildCustomerEmailHtml(email, {
    company: company.trim(),
    mobile: mobile.trim(),
    quoteNumber,
    industryName: quote.industry.name,
    baseCost: quote.industry.baseCost,
    aiCost: quote.aiCost,
    modCost: quote.modCost,
    supportCost: quote.supportCost,
    retainerCost: quote.retainerCost,
    subtotal: quote.subtotal,
    vat: quote.vat,
    total: quote.total,
    days: quote.days,
    goLiveDate: quote.goLiveDate,
    aiFeatureNames: quote.aiFeatureNames,
    moduleNames: quote.moduleNames,
    includeRetainer,
  })

  try {
    await sendEmail(smtp, {
      to: email.trim(),
      subject: `Your SGC TECH AI Quote — ${quoteNumber}`,
      html: customerHtml,
    })
  } catch (err) {
    console.error('SMTP send error (customer):', err)
    return c.json({ success: false, message: 'Failed to send email. Please try again.' }, 500)
  }

  // Invalidate token (single-use)
  if (token) await env.AIRA_BRAIN_KV.delete(`qt:${token}`)

  // Non-blocking: send notification to SGC team
  const notifHtml = buildNotificationEmailHtml({
    company: company.trim(),
    email: email.trim(),
    mobile: mobile.trim(),
    quoteNumber,
    industryName: quote.industry.name,
    total: quote.total,
    days: quote.days,
    aiFeatureNames: quote.aiFeatureNames,
    moduleNames: quote.moduleNames,
  })

  // Fire-and-forget notification (don't block response)
  sendEmail(smtp, {
    to: notificationEmail,
    subject: `[Lead] ${quoteNumber} — ${company.trim()} (AED ${quote.total.toLocaleString()})`,
    html: notifHtml,
  }).catch(err => console.error('SMTP send error (notification):', err))

  // Non-blocking: Odoo CRM lead sync
  if (env.ODOO_API_KEY) {
    createOdooLead(
      {
        url: env.ODOO_URL || 'https://scholarixglobal.com',
        db: env.ODOO_DB || 'scholarixglobal',
        user: env.ODOO_USER || 'info@scholarixglobal.com',
        apiKey: env.ODOO_API_KEY,
      },
      {
        company: company.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        industryName: quote.industry.name,
        quoteNumber,
        totalAmount: quote.total,
        features: quote.aiFeatureNames,
        modules: quote.moduleNames,
      }
    ).catch(err => console.error('Odoo sync error:', err))
  }

  return c.json({ success: true, quoteNumber })
})

export default api
