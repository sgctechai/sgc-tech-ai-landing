import { test, expect } from '@playwright/test'

test.describe('Aira Chatbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('chatbox launcher button is visible', async ({ page }) => {
    const launcher = page.locator('[data-chat-launcher]')
    await expect(launcher).toBeVisible()
  })

  test('clicking launcher opens chat panel', async ({ page }) => {
    const launcher = page.locator('[data-chat-launcher]')
    await launcher.click({ force: true, timeout: 5000 })
    const panel = page.locator('[data-chat-panel]')
    await expect(panel).toBeVisible()
  })

  test('panel displays chat input field', async ({ page }) => {
    await page.locator('[data-chat-launcher]').click({ force: true })
    const input = page.locator('[data-chat-input]')
    await expect(input).toBeVisible()
  })

  test('empty message does not send', async ({ page }) => {
    await page.locator('[data-chat-launcher]').click({ force: true })
    const input = page.locator('[data-chat-input]')
    await input.press('Enter')
    // Verify input still has focus (message not sent)
    await expect(input).toBeFocused()
  })

  test('close button hides panel', async ({ page }) => {
    const launcher = page.locator('[data-chat-launcher]')
    await launcher.click({ force: true })
    const closeBtn = page.locator('[data-chat-close]')
    await closeBtn.click({ force: true })
    const panel = page.locator('[data-chat-panel]')
    await expect(panel).not.toBeVisible()
  })

  test('launcher toggles aria-expanded', async ({ page }) => {
    const launcher = page.locator('[data-chat-launcher]')
    await expect(launcher).toHaveAttribute('aria-expanded', 'false')
    await launcher.click({ force: true })
    await expect(launcher).toHaveAttribute('aria-expanded', 'true')
  })
})