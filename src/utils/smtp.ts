/**
 * Minimal SMTP-over-TLS (implicit SSL, port 465) client for Cloudflare Workers.
 * Uses cloudflare:sockets for raw TCP with TLS.
 * Sends HTML emails via Zoho SMTP (smtppro.zoho.com:465).
 */
// @ts-ignore — cloudflare:sockets is a CF Workers runtime module
import { connect } from 'cloudflare:sockets'

export interface SmtpConfig {
  host: string
  port: number
  user: string    // SMTP username (= from address)
  pass: string    // SMTP app password
  fromName?: string
}

export interface EmailMessage {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

/** Send an HTML email via Zoho SMTP over TLS (port 465) */
export async function sendEmail(config: SmtpConfig, msg: EmailMessage): Promise<void> {
  const toList = Array.isArray(msg.to) ? msg.to : [msg.to]
  const fromDisplay = config.fromName
    ? `"${config.fromName}" <${config.user}>`
    : config.user

  // Build MIME multipart/alternative message
  const boundary = `----=_Part_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
  const subjectB64 = `=?utf-8?B?${btoa(unescape(encodeURIComponent(msg.subject)))}?=`
  const plainText = msg.text || msg.html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

  const mimeLines = [
    `From: ${fromDisplay}`,
    `To: ${toList.join(', ')}`,
    `Subject: ${subjectB64}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=utf-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    btoa(unescape(encodeURIComponent(plainText))),
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    btoa(unescape(encodeURIComponent(msg.html))),
    ``,
    `--${boundary}--`,
  ]

  // Dot-stuffing: lines starting with '.' need a leading extra '.'
  const mimeBody = mimeLines
    .map(line => (line === '.' ? '..' : line.startsWith('.') ? '.' + line : line))
    .join('\r\n')

  // Open TCP socket with immediate TLS (implicit SSL, port 465)
  // @ts-ignore
  const socket = connect(
    { hostname: config.host, port: config.port },
    { secureTransport: 'on' }
  )

  const enc = new TextEncoder()
  const dec = new TextDecoder()
  let buf = ''

  const reader = socket.readable.getReader()
  const writer = socket.writable.getWriter()

  /** Read from socket, accumulating into `buf`, extract one complete SMTP response */
  async function readResponse(): Promise<{ code: number; text: string }> {
    const lines: string[] = []
    while (true) {
      // Try to pull a complete line from buffer
      let nlIdx = buf.indexOf('\n')
      while (nlIdx < 0) {
        const { value, done } = await reader.read()
        if (done) throw new Error('SMTP: connection closed unexpectedly')
        buf += dec.decode(value)
        nlIdx = buf.indexOf('\n')
      }
      const line = buf.slice(0, nlIdx).replace(/\r$/, '')
      buf = buf.slice(nlIdx + 1)
      lines.push(line)
      // Multi-line response: "CODE-text" is continuation; "CODE text" is last line
      if (line.length < 4 || line[3] === ' ') {
        const code = parseInt(line.slice(0, 3), 10)
        return { code, text: lines.join('\n') }
      }
    }
  }

  async function cmd(command: string): Promise<{ code: number; text: string }> {
    await writer.write(enc.encode(command + '\r\n'))
    return readResponse()
  }

  async function expect(command: string, expectedCode: number): Promise<void> {
    const resp = await cmd(command)
    if (resp.code !== expectedCode) {
      throw new Error(`SMTP error after "${command.split(' ')[0]}": expected ${expectedCode}, got ${resp.code}\n${resp.text}`)
    }
  }

  try {
    // Greeting
    const greeting = await readResponse()
    if (greeting.code !== 220) throw new Error(`SMTP: unexpected greeting ${greeting.code}`)

    // EHLO
    await expect(`EHLO ${config.host}`, 250)

    // AUTH LOGIN
    const authStart = await cmd('AUTH LOGIN')
    if (authStart.code !== 334) throw new Error(`SMTP: AUTH LOGIN failed: ${authStart.text}`)

    const authUser = await cmd(btoa(config.user))
    if (authUser.code !== 334) throw new Error(`SMTP: auth user step failed: ${authUser.text}`)

    const authPass = await cmd(btoa(config.pass))
    if (authPass.code !== 235) throw new Error(`SMTP: authentication failed: ${authPass.text}`)

    // Envelope
    await expect(`MAIL FROM:<${config.user}>`, 250)
    for (const to of toList) {
      await expect(`RCPT TO:<${to}>`, 250)
    }

    // DATA
    const dataResp = await cmd('DATA')
    if (dataResp.code !== 354) throw new Error(`SMTP: DATA rejected: ${dataResp.text}`)

    // Message body — terminate with \r\n.\r\n
    await writer.write(enc.encode(mimeBody + '\r\n.\r\n'))
    const sendResult = await readResponse()
    if (sendResult.code !== 250) throw new Error(`SMTP: message rejected: ${sendResult.text}`)

    // Quit
    await writer.write(enc.encode('QUIT\r\n'))
    await readResponse().catch(() => {}) // ignore quit response errors

  } finally {
    try { await writer.close() } catch { /* ignore */ }
    try { await socket.close() } catch { /* ignore */ }
  }
}
