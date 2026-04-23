(() => {
  'use strict'

  /* ─── State ─────────────────────────────────────────────────── */
  const state = {
    industryId: null,
    industryData: null,
    aiFeatures: new Set(),
    modules: new Set(),
    includeRetainer: false,
  }

  let emailToken = null  // token issued by /api/validate-email
  let emailValidating = false

  /* ─── Data (injected by server via data-json attribute) ──────── */
  let DATA = { industries: [], aiFeatures: [], odooModules: [] }
  try {
    const el = document.getElementById('qb-data')
    if (el) DATA = JSON.parse(el.dataset.json || '{}')
  } catch (_) {}

  /* ─── DOM refs ───────────────────────────────────────────────── */
  const $ = (id) => document.getElementById(id)

  /* ─── Pricing calculation (mirrors src/utils/pricing.ts) ─────── */
  function calculateQuote() {
    const ind = DATA.industries.find(i => i.id === state.industryId)
    if (!ind) return null

    const aiCost = [...state.aiFeatures].reduce((s, id) => {
      const f = DATA.aiFeatures.find(f => f.id === id)
      return s + (f ? f.cost : 0)
    }, 0)

    const modCost = [...state.modules].reduce((s, id) => {
      const m = DATA.odooModules.find(m => m.id === id)
      return s + (m ? m.cost : 0)
    }, 0)

    const totalSel = state.aiFeatures.size + state.modules.size
    const days = Math.ceil(ind.avgDeploymentDays * (1 + (totalSel / 10) * 0.15))
    const supportCost = days * 800
    const retainerCost = state.includeRetainer ? 8000 : 0
    const subtotal = ind.baseCost + aiCost + modCost + supportCost + retainerCost
    const vat = Math.round(subtotal * 0.05)
    const total = subtotal + vat

    const goLive = new Date()
    goLive.setDate(goLive.getDate() + days)

    return { baseCost: ind.baseCost, aiCost, modCost, supportCost, retainerCost, subtotal, vat, total, days, goLive }
  }

  /* ─── Format ─────────────────────────────────────────────────── */
  function fmt(n) {
    return 'AED ' + n.toLocaleString('en-AE')
  }

  function fmtDate(d) {
    return d.toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  /* ─── Update Pricing UI ──────────────────────────────────────── */
  function updatePricingUI() {
    const q = calculateQuote()
    if (!q) return

    const set = (id, val) => { const el = $(id); if (el) el.textContent = val }

    set('qb-base-cost', fmt(q.baseCost))
    set('qb-ai-cost', fmt(q.aiCost))
    set('qb-mod-cost', fmt(q.modCost))
    set('qb-support-cost', fmt(q.supportCost))
    set('qb-subtotal', fmt(q.subtotal))
    set('qb-vat', fmt(q.vat))
    set('qb-total', fmt(q.total))
    set('qb-days', String(q.days))
    set('qb-golive-date', 'Est. ' + fmtDate(q.goLive))

    const retainerRow = $('qb-retainer-row')
    if (retainerRow) retainerRow.style.display = state.includeRetainer ? '' : 'none'
  }

  /* ─── Industry Selection ─────────────────────────────────────── */
  function selectIndustry(btn) {
    document.querySelectorAll('.qb-industry-card').forEach(c => {
      c.setAttribute('aria-pressed', 'false')
      c.classList.remove('is-selected')
    })
    btn.setAttribute('aria-pressed', 'true')
    btn.classList.add('is-selected')

    state.industryId = btn.dataset.industryId
    state.industryData = DATA.industries.find(i => i.id === state.industryId) || null

    // Update context bar
    const ctxIndustry = $('qb-context-industry')
    const ctxDays = $('qb-context-days')
    const ctxProof = $('qb-context-proof')
    if (ctxIndustry) ctxIndustry.textContent = btn.dataset.proofTitle || state.industryData?.name || ''
    if (ctxDays) ctxDays.textContent = btn.dataset.avgDays + '-day deployment'
    if (ctxProof) ctxProof.textContent = btn.dataset.proofMetric || ''

    // Apply recommended selections as visual hints (don't auto-check)
    const recAi = (btn.dataset.recommendedAi || '').split(',').filter(Boolean)
    const recMod = (btn.dataset.recommendedMod || '').split(',').filter(Boolean)
    document.querySelectorAll('.qb-cb[data-feature-kind="ai"]').forEach(cb => {
      cb.closest('.qb-checkbox-item')?.classList.toggle('is-recommended', recAi.includes(cb.dataset.featureId))
    })
    document.querySelectorAll('.qb-cb[data-feature-kind="module"]').forEach(cb => {
      cb.closest('.qb-checkbox-item')?.classList.toggle('is-recommended', recMod.includes(cb.dataset.featureId))
    })

    // Reveal builder
    const builder = $('qb-builder')
    if (builder) {
      builder.hidden = false
      builder.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    updatePricingUI()
  }

  /* ─── Checkbox handlers ──────────────────────────────────────── */
  function handleCheckbox(cb) {
    const id = cb.dataset.featureId
    const kind = cb.dataset.featureKind
    if (!id) return
    if (kind === 'ai') {
      cb.checked ? state.aiFeatures.add(id) : state.aiFeatures.delete(id)
    } else {
      cb.checked ? state.modules.add(id) : state.modules.delete(id)
    }
    updatePricingUI()
  }

  /* ─── Modal ──────────────────────────────────────────────────── */
  function openModal() {
    const modal = $('qb-modal')
    if (modal) {
      modal.hidden = false
      const companyField = $('qb-company')
      if (companyField) companyField.focus()
      // Reset success/error states
      const success = $('qb-email-success')
      const err = $('qb-modal-error')
      if (success) success.hidden = true
      if (err) { err.hidden = true; err.textContent = '' }
      // Restore actions if previously hidden
      const actions = document.querySelector('.qb-modal-actions')
      if (actions) actions.style.display = ''
      setEmailStatus('', '')
      emailToken = null
    }
  }

  function closeModal() {
    const modal = $('qb-modal')
    if (modal) modal.hidden = true
    const err = $('qb-modal-error')
    if (err) { err.hidden = true; err.textContent = '' }
  }

  function setEmailStatus(type, msg) {
    const el = $('qb-email-status')
    if (!el) return
    el.className = 'qb-email-status' + (type ? ' qb-email-status--' + type : '')
    el.textContent = msg
  }

  function showModalError(msg) {
    const err = $('qb-modal-error')
    if (err) { err.textContent = msg; err.hidden = false }
  }

  function clearModalError() {
    const err = $('qb-modal-error')
    if (err) { err.hidden = true; err.textContent = '' }
  }

  async function validateEmailField() {
    const email = $('qb-email')?.value.trim()
    if (!email) { setEmailStatus('', ''); emailToken = null; return false }

    setEmailStatus('checking', 'Checking…')
    emailValidating = true
    try {
      const res = await fetch('/api/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.valid) {
        emailToken = data.token
        setEmailStatus('valid', '✓ Valid')
        return true
      } else {
        emailToken = null
        setEmailStatus('error', data.message || 'Invalid email')
        return false
      }
    } catch {
      setEmailStatus('error', 'Could not verify email')
      return false
    } finally {
      emailValidating = false
    }
  }

  async function sendQuoteEmail() {
    const company = $('qb-company')?.value.trim()
    const email = $('qb-email')?.value.trim()
    const mobile = $('qb-mobile')?.value.trim()
    const hp = $('qb-hp')?.value || ''

    if (!company || !email || !mobile) {
      showModalError('Please fill in all required fields.')
      return
    }

    const emailBtn = $('qb-modal-email')
    if (emailBtn) {
      emailBtn.disabled = true
      emailBtn.textContent = 'Sending…'
    }
    clearModalError()

    // Ensure email is validated
    if (!emailToken) {
      const ok = await validateEmailField()
      if (!ok) {
        if (emailBtn) { emailBtn.disabled = false; emailBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> Email Me This Quote' }
        return
      }
    }

    try {
      const res = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company, email, mobile, _hp: hp,
          industryId: state.industryId,
          aiFeatureIds: [...state.aiFeatures],
          moduleIds: [...state.modules],
          includeRetainer: state.includeRetainer,
          token: emailToken,
        }),
      })
      const data = await res.json()
      if (data.success) {
        emailToken = null
        const success = $('qb-email-success')
        if (success) success.hidden = false
        const actions = document.querySelector('.qb-modal-actions')
        if (actions) actions.style.display = 'none'
      } else {
        showModalError(data.message || 'Failed to send quote. Please try again.')
        if (emailBtn) { emailBtn.disabled = false; emailBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> Email Me This Quote' }
      }
    } catch {
      showModalError('Network error. Please try again.')
      if (emailBtn) { emailBtn.disabled = false; emailBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> Email Me This Quote' }
    }
  }

  /* ─── PDF Generation ─────────────────────────────────────────── */
  function generatePDF(company, customerEmail) {
    const q = calculateQuote()
    if (!q) return

    const { jsPDF } = window.jspdf || {}
    if (!jsPDF) { alert('PDF library not loaded yet. Please wait a moment and try again.'); return }

    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
    const W = doc.internal.pageSize.getWidth()
    const H = doc.internal.pageSize.getHeight()

    const NAVY  = [11, 14, 39]
    const CYAN  = [0, 217, 255]
    const WHITE = [255, 255, 255]
    const GRAY  = [180, 190, 210]
    const LIGHT = [230, 235, 245]

    const quoteNum = 'SGC-' + Date.now().toString().slice(-6)
    const today = new Date().toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' })
    const industry = DATA.industries.find(i => i.id === state.industryId)

    // ── Cover page ──────────────────────────────────────────────
    doc.setFillColor(...NAVY)
    doc.rect(0, 0, W, H, 'F')

    // Cyan accent bar
    doc.setFillColor(...CYAN)
    doc.rect(0, 0, 6, H, 'F')

    // SGC TECH AI header
    doc.setTextColor(...CYAN)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('SGC TECH AI', 18, 28)

    doc.setTextColor(...GRAY)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Enterprise AI & ERP Solutions', 18, 35)

    // Quote number / date
    doc.setTextColor(...GRAY)
    doc.setFontSize(9)
    doc.text(quoteNum, W - 14, 22, { align: 'right' })
    doc.text(today, W - 14, 28, { align: 'right' })

    // Divider
    doc.setDrawColor(...CYAN)
    doc.setLineWidth(0.4)
    doc.line(18, 42, W - 14, 42)

    // Title
    doc.setTextColor(...WHITE)
    doc.setFontSize(26)
    doc.setFont('helvetica', 'bold')
    doc.text('Custom Implementation', 18, 60)
    doc.setTextColor(...CYAN)
    doc.text('Proposal', 18, 72)

    // Customer block
    doc.setTextColor(...GRAY)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Prepared for:', 18, 90)
    doc.setTextColor(...WHITE)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(company, 18, 98)
    if (customerEmail) {
      doc.setFontSize(9)
      doc.setTextColor(...GRAY)
      doc.text(customerEmail, 18, 105)
    }

    // Industry highlight
    doc.setFillColor(0, 217, 255, 0.08)
    doc.setFillColor(20, 30, 60)
    doc.roundedRect(18, 122, W - 36, 24, 3, 3, 'F')
    doc.setTextColor(...CYAN)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('INDUSTRY', 24, 131)
    doc.setTextColor(...WHITE)
    doc.setFontSize(12)
    doc.text(industry?.name || '—', 24, 139)
    if (industry?.proofPoint) {
      doc.setFontSize(9)
      doc.setTextColor(...GRAY)
      doc.text(industry.proofPoint.metric, W - 20, 139, { align: 'right' })
    }

    // Total cost highlight
    doc.setFillColor(20, 30, 60)
    doc.roundedRect(18, 155, W - 36, 24, 3, 3, 'F')
    doc.setTextColor(...GRAY)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL INVESTMENT (INC. VAT)', 24, 164)
    doc.setTextColor(...CYAN)
    doc.setFontSize(16)
    doc.text(fmt(q.total), 24, 173)
    doc.setTextColor(...GRAY)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Est. Go-Live: ' + fmtDate(q.goLive), W - 20, 173, { align: 'right' })

    // Footer
    doc.setTextColor(...GRAY)
    doc.setFontSize(8)
    doc.text('sgctechai.com  ·  enterprise@sgctechai.com  ·  UAE VAT Registered', W / 2, H - 12, { align: 'center' })

    // ── Page 2: Pricing Breakdown ─────────────────────────────────
    doc.addPage()
    doc.setFillColor(...NAVY)
    doc.rect(0, 0, W, H, 'F')
    doc.setFillColor(...CYAN)
    doc.rect(0, 0, 6, H, 'F')

    // Page header
    doc.setTextColor(...CYAN)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Pricing Breakdown', 18, 24)
    doc.setDrawColor(...CYAN)
    doc.setLineWidth(0.4)
    doc.line(18, 29, W - 14, 29)

    // Build line items
    const lineItems = [
      [`Base Implementation (${industry?.name || ''})`, '1', fmt(q.baseCost), fmt(q.baseCost)],
    ]
    for (const id of state.aiFeatures) {
      const f = DATA.aiFeatures.find(f => f.id === id)
      if (f) lineItems.push([f.name, '1', fmt(f.cost), fmt(f.cost)])
    }
    for (const id of state.modules) {
      const m = DATA.odooModules.find(m => m.id === id)
      if (m) lineItems.push([m.name, '1', fmt(m.cost), fmt(m.cost)])
    }
    lineItems.push([`Implementation Support (${q.days} days × AED 800)`, String(q.days), 'AED 800', fmt(q.supportCost)])
    if (state.includeRetainer) {
      lineItems.push(['90-Day Operations Retainer', '1', 'AED 8,000', 'AED 8,000'])
    }

    doc.autoTable({
      startY: 35,
      head: [['Description', 'Qty', 'Unit Price', 'Total']],
      body: lineItems,
      theme: 'plain',
      headStyles: { fillColor: [20, 30, 60], textColor: CYAN, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fillColor: NAVY, textColor: WHITE, fontSize: 9 },
      alternateRowStyles: { fillColor: [15, 20, 45] },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 15, halign: 'center' }, 2: { cellWidth: 35, halign: 'right' }, 3: { cellWidth: 35, halign: 'right' } },
      margin: { left: 18, right: 14 },
      styles: { lineColor: [30, 40, 70], lineWidth: 0.1 },
    })

    const afterTable = doc.lastAutoTable.finalY + 6

    // Totals block
    const totals = [
      ['Subtotal', fmt(q.subtotal)],
      ['VAT (5%)', fmt(q.vat)],
    ]
    doc.autoTable({
      startY: afterTable,
      body: totals,
      theme: 'plain',
      bodyStyles: { fillColor: NAVY, textColor: GRAY, fontSize: 9 },
      columnStyles: { 0: { cellWidth: 140, fontStyle: 'bold' }, 1: { cellWidth: 40, halign: 'right' } },
      margin: { left: 18, right: 14 },
      styles: { lineWidth: 0 },
    })

    const afterTotals = doc.lastAutoTable.finalY + 2
    doc.setFillColor(20, 30, 60)
    doc.roundedRect(18, afterTotals, W - 32, 12, 2, 2, 'F')
    doc.setTextColor(...CYAN)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL (INC. 5% UAE VAT)', 22, afterTotals + 8)
    doc.text(fmt(q.total), W - 16, afterTotals + 8, { align: 'right' })

    // ── Page 3: Timeline & Next Steps ────────────────────────────
    doc.addPage()
    doc.setFillColor(...NAVY)
    doc.rect(0, 0, W, H, 'F')
    doc.setFillColor(...CYAN)
    doc.rect(0, 0, 6, H, 'F')

    doc.setTextColor(...CYAN)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Implementation Timeline', 18, 24)
    doc.setDrawColor(...CYAN)
    doc.setLineWidth(0.4)
    doc.line(18, 29, W - 14, 29)

    const phases = [
      { label: 'Week 1–2', title: 'Discovery & Configuration', desc: 'Requirements gathering, system configuration, data migration planning, and environment setup.' },
      { label: 'Week 3',   title: 'Integration & Testing',    desc: 'Third-party integrations, workflow automation setup, and comprehensive testing.' },
      { label: 'Week 3–4', title: 'User Acceptance Testing',  desc: 'UAT with key stakeholders, training delivery, and sign-off on go-live readiness.' },
      { label: `Day ${q.days}`, title: 'Go-Live',             desc: `Production launch. Estimated: ${fmtDate(q.goLive)}. Hypercare support for first 30 days post-launch.` },
    ]

    let y = 42
    phases.forEach((p, i) => {
      doc.setFillColor(20, 30, 60)
      doc.roundedRect(18, y, W - 32, 22, 2, 2, 'F')
      doc.setFillColor(...CYAN)
      doc.circle(24, y + 11, 2.5, 'F')
      doc.setTextColor(...WHITE)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(p.title, 31, y + 8)
      doc.setTextColor(...CYAN)
      doc.setFontSize(8)
      doc.text(p.label, W - 16, y + 8, { align: 'right' })
      doc.setTextColor(...GRAY)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(p.desc, 31, y + 15, { maxWidth: W - 50 })
      y += 28
    })

    y += 8
    doc.setTextColor(...CYAN)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('Next Steps', 18, y)
    doc.setDrawColor(...CYAN)
    doc.setLineWidth(0.4)
    doc.line(18, y + 3, W - 14, y + 3)
    y += 12

    const steps = [
      'Review this proposal and confirm the scope meets your requirements.',
      'Schedule a 30-minute technical discovery call with our solutions team.',
      'Receive a final statement of work within 48 hours of the discovery call.',
      'Sign and pay the first milestone to kick off the project.',
    ]
    steps.forEach((s, i) => {
      doc.setFillColor(...CYAN)
      doc.circle(22, y + 2, 2, 'F')
      doc.setTextColor(...CYAN)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text(String(i + 1), 22, y + 2.8, { align: 'center' })
      doc.setTextColor(...WHITE)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(s, 28, y + 3, { maxWidth: W - 44 })
      y += 10
    })

    // Compliance footer (all pages)
    const totalPages = doc.internal.getNumberOfPages()
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p)
      doc.setTextColor(...GRAY)
      doc.setFontSize(7)
      doc.text(
        `This proposal is valid for 30 days from ${today}. All prices in AED and include 5% UAE VAT. SGC TECH AI is VAT registered in the UAE. Quote ${quoteNum}.`,
        W / 2, H - 8, { align: 'center', maxWidth: W - 28 }
      )
      doc.text(`Page ${p} of ${totalPages}`, W - 14, H - 8, { align: 'right' })
    }

    const safeName = (company || 'Quote').replace(/[^a-zA-Z0-9]/g, '-')
    doc.save(`SGC-Quote-${quoteNum}-${safeName}.pdf`)
  }

  /* ─── Event Binding ──────────────────────────────────────────── */
  function init() {
    // Industry card clicks
    document.getElementById('qb-industries')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.qb-industry-card')
      if (btn) selectIndustry(btn)
    })

    // Checkbox changes (AI features + ERP modules)
    document.querySelector('.qb-columns')?.addEventListener('change', (e) => {
      if (e.target.classList.contains('qb-cb') && e.target.dataset.featureKind) {
        handleCheckbox(e.target)
      }
    })

    // Retainer toggle
    const retainerCb = $('qb-retainer-cb')
    if (retainerCb) {
      retainerCb.addEventListener('change', () => {
        state.includeRetainer = retainerCb.checked
        updatePricingUI()
      })
    }

    // Open PDF modal
    $('qb-pdf-btn')?.addEventListener('click', () => {
      if (!state.industryId) {
        $('qb-step-industry')?.scrollIntoView({ behavior: 'smooth' })
        return
      }
      openModal()
    })

    // Modal close buttons
    $('qb-modal-close')?.addEventListener('click', closeModal)
    $('qb-modal-cancel')?.addEventListener('click', closeModal)

    // Close modal on overlay click
    $('qb-modal')?.addEventListener('click', (e) => {
      if (e.target === $('qb-modal')) closeModal()
    })

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !$('qb-modal')?.hidden) closeModal()
    })

    // Debounced email validation on blur
    $('qb-email')?.addEventListener('blur', () => {
      const email = $('qb-email')?.value.trim()
      if (email && !emailValidating) validateEmailField()
    })
    $('qb-email')?.addEventListener('input', () => {
      // Clear token when user edits the email
      emailToken = null
      setEmailStatus('', '')
    })

    // Download PDF button
    $('qb-modal-download')?.addEventListener('click', async () => {
      const company = $('qb-company')?.value.trim()
      const email = $('qb-email')?.value.trim()
      const mobile = $('qb-mobile')?.value.trim()

      if (!company) { showModalError('Please enter your company name.'); $('qb-company')?.focus(); return }
      if (!email) { showModalError('Please enter your work email.'); $('qb-email')?.focus(); return }
      if (!mobile) { showModalError('Please enter your mobile number.'); $('qb-mobile')?.focus(); return }
      clearModalError()

      // Validate email before PDF (ensures real lead capture)
      if (!emailToken) {
        const ok = await validateEmailField()
        if (!ok) return
      }
      closeModal()
      generatePDF(company, email)
    })

    // Email quote button
    $('qb-modal-email')?.addEventListener('click', sendQuoteEmail)

    // Signal that JS has fully initialized (used by E2E tests)
    window.QBInitialized = true
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
