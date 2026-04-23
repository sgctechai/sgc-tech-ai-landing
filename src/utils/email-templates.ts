/**
 * HTML email templates for the SGC TECH AI quote builder.
 * Dark navy brand theme consistent with the website.
 */

export interface QuoteEmailData {
  company: string
  mobile: string
  quoteNumber: string
  industryName: string
  baseCost: number
  aiCost: number
  modCost: number
  supportCost: number
  retainerCost: number
  subtotal: number
  vat: number
  total: number
  days: number
  goLiveDate: string
  aiFeatureNames: string[]
  moduleNames: string[]
  includeRetainer: boolean
}

function fmt(n: number): string {
  return 'AED ' + n.toLocaleString('en-AE')
}

function row(label: string, value: string, highlight = false): string {
  const bg = highlight ? '#0d3b4a' : 'transparent'
  const color = highlight ? '#00d9ff' : '#b4bed2'
  const weight = highlight ? 'bold' : 'normal'
  return `
    <tr>
      <td style="padding:8px 12px;background:${bg};color:${color};font-weight:${weight};">${label}</td>
      <td style="padding:8px 12px;background:${bg};color:${color};font-weight:${weight};text-align:right;">${value}</td>
    </tr>`
}

export function buildCustomerEmailHtml(email: string, data: QuoteEmailData): string {
  const featureList = data.aiFeatureNames.length
    ? data.aiFeatureNames.map(f => `<li style="margin:4px 0;color:#b4bed2;">${f}</li>`).join('')
    : '<li style="color:#b4bed2;">None selected</li>'

  const moduleList = data.moduleNames.length
    ? data.moduleNames.map(m => `<li style="margin:4px 0;color:#b4bed2;">${m}</li>`).join('')
    : '<li style="color:#b4bed2;">None selected</li>'

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#070a1a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070a1a;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0b0e27;border:1px solid #1a2044;border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:#0b0e27;padding:32px 32px 16px;border-bottom:2px solid #00d9ff;">
          <table width="100%"><tr>
            <td><span style="font-size:20px;font-weight:bold;color:#00d9ff;letter-spacing:1px;">SGC TECH AI</span>
              <div style="font-size:11px;color:#b4bed2;margin-top:2px;">Enterprise AI &amp; ERP Solutions</div></td>
            <td align="right"><span style="font-size:11px;color:#b4bed2;">${data.quoteNumber}</span></td>
          </tr></table>
        </td></tr>

        <!-- Greeting -->
        <tr><td style="padding:28px 32px 12px;">
          <h1 style="margin:0 0 8px;font-size:22px;color:#ffffff;">Your Custom Quote is Ready</h1>
          <p style="margin:0;color:#b4bed2;font-size:14px;line-height:1.6;">
            Hi ${data.company}, thank you for using the SGC TECH AI Quote Builder.
            Below is your personalised implementation proposal for the <strong style="color:#00d9ff;">${data.industryName}</strong> industry.
          </p>
        </td></tr>

        <!-- Total highlight -->
        <tr><td style="padding:0 32px 24px;">
          <div style="background:#0d3b4a;border:1px solid #00d9ff;border-radius:8px;padding:20px 24px;text-align:center;">
            <div style="font-size:12px;color:#b4bed2;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Total Investment (inc. 5% VAT)</div>
            <div style="font-size:32px;font-weight:bold;color:#00d9ff;">${fmt(data.total)}</div>
            <div style="font-size:12px;color:#b4bed2;margin-top:6px;">Est. Go-Live: ${data.goLiveDate} · ${data.days} working days</div>
          </div>
        </td></tr>

        <!-- Pricing breakdown -->
        <tr><td style="padding:0 32px 24px;">
          <h2 style="font-size:14px;color:#ffffff;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Pricing Breakdown</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#111530;border-radius:8px;overflow:hidden;">
            ${row('Base Implementation', fmt(data.baseCost))}
            ${row('AI Features', fmt(data.aiCost))}
            ${row('ERP Modules', fmt(data.modCost))}
            ${row('Implementation Support', fmt(data.supportCost))}
            ${data.includeRetainer ? row('Operations Retainer', fmt(data.retainerCost)) : ''}
            ${row('Subtotal', fmt(data.subtotal))}
            ${row('VAT (5%)', fmt(data.vat))}
            ${row('TOTAL', fmt(data.total), true)}
          </table>
        </td></tr>

        <!-- Features & Modules -->
        <tr><td style="padding:0 32px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="48%" valign="top" style="padding-right:12px;">
                <h3 style="font-size:13px;color:#00d9ff;margin:0 0 10px;text-transform:uppercase;letter-spacing:1px;">AI Features</h3>
                <ul style="margin:0;padding:0 0 0 16px;">${featureList}</ul>
              </td>
              <td width="4%"></td>
              <td width="48%" valign="top">
                <h3 style="font-size:13px;color:#00d9ff;margin:0 0 10px;text-transform:uppercase;letter-spacing:1px;">ERP Modules</h3>
                <ul style="margin:0;padding:0 0 0 16px;">${moduleList}</ul>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 32px 32px;text-align:center;">
          <a href="https://app.cal.com/sgctech" style="display:inline-block;background:#00d9ff;color:#0b0e27;font-weight:bold;font-size:14px;padding:14px 32px;border-radius:6px;text-decoration:none;">Book a Discovery Call</a>
          <p style="margin:16px 0 0;font-size:12px;color:#b4bed2;">This quote is valid for 30 days. Reply to this email with any questions.</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 32px;border-top:1px solid #1a2044;text-align:center;">
          <p style="margin:0;font-size:11px;color:#4a5568;">SGC TECH AI · sgctech.ai · enterprise@sgctechai.com · UAE VAT Registered</p>
          <p style="margin:6px 0 0;font-size:11px;color:#4a5568;">You received this because you requested a quote at sgctech.ai/quote-builder</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`
}

export interface NotificationEmailData {
  company: string
  email: string
  mobile: string
  quoteNumber: string
  industryName: string
  total: number
  days: number
  aiFeatureNames: string[]
  moduleNames: string[]
}

export function buildNotificationEmailHtml(data: NotificationEmailData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:24px;">
  <div style="max-width:560px;background:#fff;border-radius:8px;padding:28px;border:1px solid #ddd;">
    <h2 style="margin:0 0 16px;color:#0b0e27;">🔔 New Quote Request — ${data.quoteNumber}</h2>
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;color:#555;width:140px;">Company</td><td style="padding:8px 0;font-weight:bold;">${data.company}</td></tr>
      <tr><td style="padding:8px 0;color:#555;">Email</td><td style="padding:8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
      <tr><td style="padding:8px 0;color:#555;">Mobile</td><td style="padding:8px 0;">${data.mobile}</td></tr>
      <tr><td style="padding:8px 0;color:#555;">Industry</td><td style="padding:8px 0;">${data.industryName}</td></tr>
      <tr><td style="padding:8px 0;color:#555;">Quote Total</td><td style="padding:8px 0;font-weight:bold;color:#0b0e27;">AED ${data.total.toLocaleString()}</td></tr>
      <tr><td style="padding:8px 0;color:#555;">Deploy Days</td><td style="padding:8px 0;">${data.days} days</td></tr>
      <tr><td style="padding:8px 0;color:#555;">AI Features</td><td style="padding:8px 0;">${data.aiFeatureNames.join(', ') || '—'}</td></tr>
      <tr><td style="padding:8px 0;color:#555;">ERP Modules</td><td style="padding:8px 0;">${data.moduleNames.join(', ') || '—'}</td></tr>
    </table>
    <hr style="margin:20px 0;border:none;border-top:1px solid #eee;">
    <p style="margin:0;font-size:12px;color:#999;">Sent by SGC TECH AI Quote Builder · sgctech.ai · Odoo sync triggered separately</p>
  </div>
</body></html>`
}
