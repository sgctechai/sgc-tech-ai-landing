/**
 * Odoo JSON-RPC client for creating CRM leads.
 * Uses Odoo's /jsonrpc endpoint with API key authentication.
 *
 * Setup: Generate an API key in Odoo → Settings → Technical → API Keys
 * Set as Cloudflare secret: wrangler secret put ODOO_API_KEY
 */

export interface OdooConfig {
  url: string         // e.g. https://scholarixglobal.com
  db: string          // e.g. scholarixglobal
  user: string        // login email
  apiKey: string      // API key from Odoo settings
}

export interface LeadData {
  company: string
  email: string
  mobile: string
  industryName: string
  quoteNumber: string
  totalAmount: number
  features: string[]
  modules: string[]
}

async function jsonRpc(url: string, service: string, method: string, args: unknown[]): Promise<unknown> {
  const res = await fetch(`${url}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: Date.now(),
      params: { service, method, args },
    }),
  })
  if (!res.ok) throw new Error(`Odoo HTTP error: ${res.status}`)
  const data = await res.json() as { result?: unknown; error?: { message: string } }
  if (data.error) throw new Error(`Odoo RPC error: ${data.error.message}`)
  return data.result
}

/** Create a CRM lead in Odoo. Returns the new lead ID, or throws on failure. */
export async function createOdooLead(config: OdooConfig, lead: LeadData): Promise<number> {
  // Authenticate to get uid
  const uid = await jsonRpc(config.url, 'common', 'authenticate', [
    config.db, config.user, config.apiKey, {},
  ]) as number

  if (!uid) throw new Error('Odoo: authentication failed — check credentials')

  // Build description
  const description = [
    `Quote Reference: ${lead.quoteNumber}`,
    `Industry: ${lead.industryName}`,
    `Total Amount: AED ${lead.totalAmount.toLocaleString()}`,
    ``,
    `AI Features: ${lead.features.length > 0 ? lead.features.join(', ') : 'None'}`,
    `ERP Modules: ${lead.modules.length > 0 ? lead.modules.join(', ') : 'None'}`,
    ``,
    `Source: SGC TECH AI Quote Builder (sgctech.ai/quote-builder)`,
  ].join('\n')

  // Create lead
  const leadId = await jsonRpc(config.url, 'object', 'execute_kw', [
    config.db, uid, config.apiKey,
    'crm.lead', 'create',
    [{
      name: `[${lead.quoteNumber}] ${lead.company} — ${lead.industryName}`,
      partner_name: lead.company,
      email_from: lead.email,
      mobile: lead.mobile,
      description,
      type: 'lead',
      source_id: false,
      tag_ids: [],
    }],
  ]) as number

  return leadId
}
