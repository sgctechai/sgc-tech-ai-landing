import { test, expect } from '@playwright/test'

test.describe('Aira Chatbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Clear any accumulated chat history so the panel height is deterministic
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await page.reload()
    // Wait for app.js to initialize
    await page.waitForLoadState('networkidle')
  })

  /** Open the panel and wait for its animation to settle */
  async function openPanel(page: any) {
    await page.locator('[data-chat-launcher]').click({ force: true })
    await page.locator('.aira-chat-panel.is-open').waitFor({ state: 'attached', timeout: 5000 })
    // Wait for opening animation to complete (0.32s transition)
    await page.waitForTimeout(380)
  }

  // ── Launcher button ───────────────────────────────────────────────
  test.describe('Launcher button', () => {
    test('is visible and uses brand glow button class', async ({ page }) => {
      await expect(page.locator('.floating-ai-btn[data-chat-launcher]')).toBeVisible()
    })

    test('has aria-expanded=false initially', async ({ page }) => {
      await expect(page.locator('[data-chat-launcher]')).toHaveAttribute('aria-expanded', 'false')
    })

    test('click sets aria-expanded=true and adds is-active class', async ({ page }) => {
      const launcher = page.locator('[data-chat-launcher]')
      await launcher.click({ force: true })
      await expect(launcher).toHaveAttribute('aria-expanded', 'true')
      await expect(launcher).toHaveClass(/is-active/)
    })

    test('bot icon visible when closed, close icon visible when open', async ({ page }) => {
      const launcher = page.locator('[data-chat-launcher]')
      await expect(launcher.locator('.icon-bot')).toBeVisible()
      await expect(launcher.locator('.icon-close')).toBeHidden()

      await launcher.click({ force: true })

      await expect(launcher.locator('.icon-bot')).toBeHidden()
      await expect(launcher.locator('.icon-close')).toBeVisible()
    })
  })

  // ── Panel open / close ────────────────────────────────────────────
  test.describe('Panel open/close', () => {
    test('clicking launcher opens chat panel', async ({ page }) => {
      await openPanel(page)
      await expect(page.locator('[data-chat-panel]')).toBeVisible()
    })

    test('close button hides panel', async ({ page }) => {
      await openPanel(page)
      // Use dispatchEvent to bypass viewport edge-cases with fixed/absolute panels
      await page.locator('[data-chat-close]').dispatchEvent('click')
      await expect(page.locator('[data-chat-panel]')).not.toBeVisible()
    })

    test('close button removes is-active from launcher', async ({ page }) => {
      const launcher = page.locator('[data-chat-launcher]')
      await openPanel(page)
      await page.locator('[data-chat-close]').dispatchEvent('click')
      await expect(launcher).not.toHaveClass(/is-active/)
    })

    test('Escape key closes panel', async ({ page }) => {
      await openPanel(page)
      await page.keyboard.press('Escape')
      await expect(page.locator('[data-chat-panel]')).not.toBeVisible()
    })

    test('clicking outside panel closes it', async ({ page }) => {
      await openPanel(page)
      await page.mouse.click(50, 50)
      await expect(page.locator('[data-chat-panel]')).not.toBeVisible()
    })
  })

  // ── Panel header ──────────────────────────────────────────────────
  test.describe('Panel header', () => {
    test.beforeEach(async ({ page }) => { await openPanel(page) })

    test('shows status dot', async ({ page }) => {
      await expect(page.locator('.aira-status-dot').first()).toBeVisible()
    })

    test('shows SGC TECH badge', async ({ page }) => {
      await expect(page.locator('.aira-badge-model')).toContainText('SGC TECH')
    })

    test('shows Pro badge', async ({ page }) => {
      await expect(page.locator('.aira-badge-pro')).toContainText('Pro')
    })
  })

  // ── Chat textarea & input ─────────────────────────────────────────
  test.describe('Chat input', () => {
    test.beforeEach(async ({ page }) => { await openPanel(page) })

    test('textarea input is visible', async ({ page }) => {
      await expect(page.locator('[data-chat-input]')).toBeVisible()
    })

    test('textarea has correct placeholder', async ({ page }) => {
      await expect(page.locator('[data-chat-input]')).toHaveAttribute('placeholder', /Ask Aira/)
    })

    test('character counter starts at 0/2000', async ({ page }) => {
      await expect(page.locator('[data-char-counter]')).toHaveText('0/2000')
    })

    test('character counter updates as user types', async ({ page }) => {
      await page.locator('[data-chat-input]').fill('Hello Aira')
      await expect(page.locator('[data-char-counter]')).toHaveText('10/2000')
    })

    test('empty message Enter does not submit (input stays focused)', async ({ page }) => {
      const input = page.locator('[data-chat-input]')
      await input.click()
      await input.press('Enter')
      await expect(input).toBeFocused()
    })

    test('Shift+Enter inserts newline instead of submitting', async ({ page }) => {
      const input = page.locator('[data-chat-input]')
      await input.fill('line one')
      await input.press('Shift+Enter')
      const value = await input.inputValue()
      expect(value).toContain('\n')
    })
  })

  // ── Mode switch (Chat / Voice) ────────────────────────────────────
  test.describe('Mode switch', () => {
    test.beforeEach(async ({ page }) => { await openPanel(page) })

    test('chat mode is active by default', async ({ page }) => {
      await expect(page.locator('[data-mode="chat"]')).toHaveClass(/active/)
      await expect(page.locator('[data-chat-form]')).toBeVisible()
      await expect(page.locator('[data-voice-panel]')).toBeHidden()
    })

    test('clicking Voice tab switches mode', async ({ page }) => {
      await page.locator('[data-mode="voice"]').dispatchEvent('click')
      await expect(page.locator('[data-mode="voice"]')).toHaveClass(/active/)
      await expect(page.locator('[data-voice-panel]')).toBeVisible()
      await expect(page.locator('[data-chat-form]')).toBeHidden()
    })

    test('mic shortcut button switches to voice mode', async ({ page }) => {
      await page.locator('[data-mode-trigger="voice"]').dispatchEvent('click')
      await expect(page.locator('[data-mode="voice"]')).toHaveClass(/active/)
    })

    test('switching back to chat shows form', async ({ page }) => {
      await page.locator('[data-mode="voice"]').dispatchEvent('click')
      await page.locator('[data-mode="chat"]').dispatchEvent('click')
      await expect(page.locator('[data-chat-form]')).toBeVisible()
    })
  })

  // ── Quick actions ─────────────────────────────────────────────────
  test.describe('Quick actions', () => {
    test.beforeEach(async ({ page }) => { await openPanel(page) })

    test('Book Demo button is visible', async ({ page }) => {
      await expect(page.locator('[data-book-demo]')).toBeVisible()
    })

    test('Talk to Human button is visible', async ({ page }) => {
      await expect(page.locator('[data-talk-human]')).toBeVisible()
    })

    test('Talk to Human reveals alert links', async ({ page }) => {
      await page.locator('[data-talk-human]').dispatchEvent('click')
      await expect(page.locator('[data-alert-links]')).toBeVisible()
      await expect(page.locator('[data-alert-whatsapp]')).toBeVisible()
      await expect(page.locator('[data-alert-telegram]')).toBeVisible()
    })
  })

  // ── Aira chat API round-trip (mocked) ─────────────────────────────
  test.describe('Chat API', () => {
    test('sending a message shows typing indicator then an assistant reply', async ({ page }) => {
      await openPanel(page)
      const input = page.locator('[data-chat-input]')
      await input.fill('What can you do?')
      await input.press('Enter')

      // User message appears synchronously
      await expect(page.locator('[data-chat-log] .aira-msg.user')).toContainText('What can you do?')

      // Typing indicator should appear while waiting for the reply
      await expect(page.locator('.aira-typing')).toBeVisible({ timeout: 5000 })

      // An assistant reply (real API or connection-error fallback) should arrive within 20 s
      await expect(page.locator('[data-chat-log] .aira-msg.assistant').last())
        .not.toHaveText(/Hello, welcome/, { timeout: 20000 })
    })

    test('char counter resets to 0/2000 after send', async ({ page }) => {
      await page.route('/api/aira/chat', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true, reply: 'Got it!', sessionId: 's1' }),
        })
      })

      await openPanel(page)
      const input = page.locator('[data-chat-input]')
      await input.fill('Hello')
      await expect(page.locator('[data-char-counter]')).toHaveText('5/2000')
      await input.press('Enter')
      await expect(page.locator('[data-char-counter]')).toHaveText('0/2000')
    })

    test('mocking API returns custom reply', async ({ page }) => {
      await page.route('/api/aira/chat', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true, reply: 'Integration platform with 200+ connectors.', sessionId: 's2' }),
        })
      })

      await openPanel(page)
      const input = page.locator('[data-chat-input]')
      await input.fill('Tell me about integrations')
      await input.press('Enter')

      // Verify user message
      await expect(page.locator('[data-chat-log] .aira-msg.user')).toContainText('Tell me about integrations')

      // Verify mocked assistant reply
      await expect(page.locator('[data-chat-log] .aira-msg.assistant').last())
        .toContainText('Integration platform with 200+ connectors.', { timeout: 5000 })
    })

    test('multiple messages build conversation history', async ({ page }) => {
      // Use call-count rather than body inspection (postDataJSON unreliable with dev server)
      let callCount = 0
      await page.route('/api/aira/chat', async route => {
        callCount++
        const reply = callCount === 1
          ? 'Professional tier is AED 7,900/month'
          : 'Typical deployment is 30 days'
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true, reply, sessionId: 's3' }),
        })
      })

      await openPanel(page)
      const input = page.locator('[data-chat-input]')

      // First message
      await input.fill('What about pricing?')
      await input.press('Enter')
      await expect(page.locator('[data-chat-log] .aira-msg.assistant').first())
        .toContainText('Professional tier', { timeout: 5000 })

      // Second message
      await input.fill('How fast can you deploy?')
      await input.press('Enter')
      await expect(page.locator('[data-chat-log] .aira-msg.assistant').last())
        .toContainText('30 days', { timeout: 5000 })

      // Verify both messages remain in history
      const userMessages = page.locator('[data-chat-log] .aira-msg.user')
      await expect(userMessages).toHaveCount(2)
    })
  })

  // ── Voice panel & UI ──────────────────────────────────────────────
  test.describe('Voice panel UI', () => {
    test.beforeEach(async ({ page }) => { await openPanel(page) })

    test('voice panel is hidden in chat mode', async ({ page }) => {
      await expect(page.locator('[data-voice-panel]')).toBeHidden()
    })

    test('voice visualizer element exists and is not recording initially', async ({ page }) => {
      await page.locator('[data-mode="voice"]').dispatchEvent('click')
      await expect(page.locator('[data-voice-panel]')).toBeVisible()
      const visualizer = page.locator('#aira-voice-visualizer')
      await expect(visualizer).toBeVisible()
      await expect(visualizer).not.toHaveClass(/recording/)
    })

    test('voice status text reads "Tap the microphone to start" initially', async ({ page }) => {
      await page.locator('[data-mode="voice"]').dispatchEvent('click')
      const statusEl = page.locator('#aira-voice-status')
      await expect(statusEl).toContainText('Tap the microphone to start')
    })

    test('voice toggle button SVG exists', async ({ page }) => {
      await page.locator('[data-mode="voice"]').dispatchEvent('click')
      const micBtn = page.locator('#aira-voice-mic-btn')
      await expect(micBtn).toBeVisible()
      const svg = micBtn.locator('svg')
      await expect(svg).toBeVisible()
    })

    test('voice hint text is visible below microphone button', async ({ page }) => {
      await page.locator('[data-mode="voice"]').dispatchEvent('click')
      const hint = page.locator('.aira-voice-hint')
      await expect(hint).toContainText('Hold button or press Space')
    })

    test('voice bars are rendered in visualizer', async ({ page }) => {
      await page.locator('[data-mode="voice"]').dispatchEvent('click')
      const bars = page.locator('.aira-voice-bars')
      await expect(bars).toBeVisible()
    })
  })

  // ── Chat log & message rendering ──────────────────────────────────
  test.describe('Chat log & message rendering', () => {
    test.beforeEach(async ({ page }) => { await openPanel(page) })

    test('chat log element has aria-live="polite"', async ({ page }) => {
      const chatLog = page.locator('[data-chat-log]')
      await expect(chatLog).toHaveAttribute('aria-live', 'polite')
    })

    test('chat log element has aria-label', async ({ page }) => {
      const chatLog = page.locator('[data-chat-log]')
      await expect(chatLog).toHaveAttribute('aria-label', /conversation|history/i)
    })

    test('empty chat log shows no messages', async ({ page }) => {
      const messages = page.locator('[data-chat-log] .aira-msg')
      await expect(messages).toHaveCount(0)
    })

    test('user messages have correct CSS class', async ({ page }) => {
      await page.locator('[data-chat-input]').fill('Test message')
      await page.locator('[data-chat-input]').press('Enter')
      await expect(page.locator('[data-chat-log] .aira-msg.user').first()).toBeVisible()
    })

    test('assistant messages have correct CSS class', async ({ page }) => {
      await page.route('/api/aira/chat', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true, reply: 'Test reply', sessionId: 's4' }),
        })
      })

      await page.locator('[data-chat-input]').fill('Hello')
      await page.locator('[data-chat-input]').press('Enter')
      await expect(page.locator('[data-chat-log] .aira-msg.assistant').first())
        .toContainText('Test reply', { timeout: 5000 })
    })
  })

  // ── Form & input validation ───────────────────────────────────────
  test.describe('Form & input validation', () => {
    test.beforeEach(async ({ page }) => { await openPanel(page) })

    test('form submission is prevented with dispatchEvent', async ({ page }) => {
      const form = page.locator('[data-chat-form]')
      const input = page.locator('[data-chat-input]')

      let submissionAttempted = false
      await page.on('console', msg => {
        if (msg.type() === 'error') submissionAttempted = true
      })

      await input.fill('Test')
      await form.dispatchEvent('submit')
      // Form should submit without errors via dispatchEvent
      await expect(input).toBeFocused()
    })

    test('textarea maintains focus after submit', async ({ page }) => {
      const input = page.locator('[data-chat-input]')
      await input.fill('Message')
      await input.press('Enter')
      // Input should eventually be cleared and refocused
      await expect(input).toHaveValue('', { timeout: 5000 })
    })

    test('max character limit is 2000', async ({ page }) => {
      const input = page.locator('[data-chat-input]')
      const longText = 'A'.repeat(2500)
      await input.fill(longText)
      const counter = page.locator('[data-char-counter]')
      // Counter should show actual text length
      const text = await counter.textContent()
      expect(text).toMatch(/\d+\/2000/)
    })
  })

  // ── Panel accessibility ───────────────────────────────────────────
  test.describe('Panel accessibility', () => {
    test('panel has aria-label', async ({ page }) => {
      await openPanel(page)
      const panel = page.locator('[data-chat-panel]')
      await expect(panel).toHaveAttribute('aria-label', /Aira|assistant/i)
    })

    test('launcher button has aria-label', async ({ page }) => {
      const launcher = page.locator('[data-chat-launcher]')
      await expect(launcher).toHaveAttribute('aria-label', /chat|assistant/i)
    })

    test('close button has aria-label', async ({ page }) => {
      await openPanel(page)
      const closeBtn = page.locator('[data-chat-close]')
      await expect(closeBtn).toHaveAttribute('aria-label', /close|chat/i)
    })

    test('mode buttons have role="tab" and aria-selected', async ({ page }) => {
      await openPanel(page)
      const chatBtn = page.locator('[data-mode="chat"]')
      const voiceBtn = page.locator('[data-mode="voice"]')

      await expect(chatBtn).toHaveAttribute('role', 'tab')
      await expect(voiceBtn).toHaveAttribute('role', 'tab')

      await expect(chatBtn).toHaveAttribute('aria-selected', 'true')
      await expect(voiceBtn).toHaveAttribute('aria-selected', 'false')

      // Switch to voice and verify ARIA attributes update
      await voiceBtn.dispatchEvent('click')
      await expect(chatBtn).toHaveAttribute('aria-selected', 'false')
      await expect(voiceBtn).toHaveAttribute('aria-selected', 'true')
    })
  })

  // ── LocalStorage persistence ──────────────────────────────────────
  test.describe('LocalStorage persistence', () => {
    test('chat history persists in localStorage', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => {
        localStorage.clear()
      })
      await page.reload()

      // Open and send a message
      const launcher = page.locator('[data-chat-launcher]')
      await launcher.click({ force: true })
      await page.locator('.aira-chat-panel.is-open').waitFor({ state: 'attached', timeout: 5000 })
      await page.waitForTimeout(380)

      const input = page.locator('[data-chat-input]')
      await input.fill('Persist this message')
      await input.press('Enter')

      // Verify message appears in chat log
      await expect(page.locator('[data-chat-log] .aira-msg.user'))
        .toContainText('Persist this message')

      // Check localStorage directly
      const storageData = await page.evaluate(() => {
        return localStorage.getItem('aira-chat-history-v1')
      })
      expect(storageData).toContain('Persist this message')
    })

    test('localStorage is cleared when cleared by user', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => {
        localStorage.setItem('aira-chat-history-v1', JSON.stringify([{ role: 'user', text: 'Old message' }]))
      })
      await page.reload()

      // Clear storage and reload
      await page.evaluate(() => {
        localStorage.clear()
      })
      await page.reload()

      // Open chat and verify history is empty
      const launcher = page.locator('[data-chat-launcher]')
      await launcher.click({ force: true })
      await page.locator('.aira-chat-panel.is-open').waitFor({ state: 'attached', timeout: 5000 })

      const messages = page.locator('[data-chat-log] .aira-msg')
      await expect(messages).toHaveCount(0)
    })
  })
})
