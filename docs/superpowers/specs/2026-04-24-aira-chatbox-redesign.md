# Aira Chatbox Redesign — Design Spec

**Date:** 2026-04-24  
**Status:** Approved  
**Scope:** UI cleanup of Aira chatbox widget — no backend changes

---

## Problem

The Aira chatbox contains too much informational noise: mode status text, recording disclaimers, sync status, and a welcome message that duplicates the page's existing copy. These elements fill vertical space, distract from the conversation, and lower perceived quality.

---

## Goals

1. Move the welcome/brand message into a standalone popup overlay shown on page load.
2. Strip all status/noise text from inside the chatbox.
3. Keep the functional elements: Chat/Voice toggle, chat log, input form, Book Demo button, Talk to Human button.
4. Keep WhatsApp and Telegram links hidden until "Talk to Human" is clicked (already correct — no logic change needed).

---

## Out of Scope

- Backend changes (`/api/aira/memory`, KV sync logic)
- Chat or voice functionality
- Any refactoring beyond what serves the UI cleanup

---

## Design

### 1. Welcome Popup Overlay

**Trigger:** Shown automatically on page load, once per browser session.  
**Persistence:** `sessionStorage.getItem('aira-welcomed')` — if set, skip. Set it when user dismisses.  
**Dismiss:** User clicks "Chat" or "Voice" button inside the popup.  
**Effect on dismiss:** Popup fades out and is removed from DOM; chatbox opens (`data-chat-panel` `hidden` removed) in the selected mode.

**HTML (added to `src/index.tsx`, outside `.aira-chatbox`):**
```html
<div id="aira-welcome-popup" class="aira-welcome-overlay" aria-modal="true" role="dialog">
  <div class="aira-welcome-card">
    <p class="aira-welcome-title">Welcome to SGC TECH AI</p>
    <p class="aira-welcome-body">We help B2B teams cut operational cost, automate workflows, and deploy production AI in as little as 30 days.</p>
    <div class="aira-welcome-actions">
      <button type="button" class="aira-welcome-btn aira-welcome-chat" data-welcome-mode="chat">Chat</button>
      <button type="button" class="aira-welcome-btn aira-welcome-voice" data-welcome-mode="voice">Voice</button>
    </div>
  </div>
</div>
```

**CSS classes (added to `style.css`):**
- `.aira-welcome-overlay` — fixed fullscreen backdrop, `background: rgba(0,0,0,0.6)`, `z-index: 9999`, centered flex, fade-out animation on dismiss
- `.aira-welcome-card` — centered card, `background: #0d1130`, border `rgba(0,217,255,0.25)`, padding, border-radius
- `.aira-welcome-title` — `font-size: 18px`, bold, near-white
- `.aira-welcome-body` — `font-size: 13px`, muted grey, `line-height: 1.6`
- `.aira-welcome-actions` — flex row, gap
- `.aira-welcome-btn` — shared button base (border-radius, padding, font-weight)
- `.aira-welcome-chat` — filled cyan (`#00d9ff`, dark text)
- `.aira-welcome-voice` — ghost style (transparent bg, white border, white text)

**JS (in `initAiraChatbox()`, called on DOMContentLoaded):**
```js
function initWelcomePopup() {
  if (sessionStorage.getItem('aira-welcomed')) return;
  const overlay = document.getElementById('aira-welcome-popup');
  if (!overlay) return;
  overlay.querySelectorAll('[data-welcome-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.welcomeMode; // 'chat' | 'voice'
      sessionStorage.setItem('aira-welcomed', '1');
      overlay.classList.add('aira-welcome-overlay--exit');
      overlay.addEventListener('animationend', () => overlay.remove(), { once: true });
      // Open chatbox in chosen mode
      chatPanel.hidden = false;
      setMode(mode);
    });
  });
}
```

---

### 2. Chatbox HTML Changes (`src/index.tsx`)

**Remove these elements entirely:**
- `<p class="aira-chat-welcome">` — welcome text block
- `<p class="aira-mode-copy" data-mode-copy>` — "Chat mode is active…" text
- `<p class="aira-voice-status" data-voice-status>` inside `.aira-voice-panel` — "Voice mode ready…"
- `<p class="aira-alert-status" data-alert-status>` — "Attempting Telegram…" text
- `<p class="aira-recording-note">` — "Conversation and AI memory are recorded…"
- `<p class="aira-sync-note" data-sync-status>` — "Central memory sync: checking…"

**Keep:**
- `.aira-mode-switch` with Chat/Voice buttons
- `.aira-chat-log`
- `.aira-chat-form` with input + Send
- `.aira-voice-panel` with the `data-voice-toggle` button (just remove the status `<p>`)
- `.aira-quick-actions` with Book Demo + Talk to Human
- `.aira-alert-links` with WhatsApp + Telegram (remains `hidden` until Talk to Human click)

---

### 3. CSS Changes (`style.css`)

Remove (or scope to `display: none`) rules for the removed elements:
- `.aira-chat-welcome`
- `.aira-mode-copy`
- `.aira-voice-status`
- `.aira-alert-status`
- `.aira-recording-note`
- `.aira-sync-note`

Add popup overlay rules (see Section 1 above).

---

### 4. JavaScript Changes (`app.js`)

**`setMode(mode)` function:** Remove the line that updates `modeCopy.textContent` (the element no longer exists). Remove the `const modeCopy` selector.

**`setSyncStatus(text, level)` function:** Keep the function body as-is OR make it a no-op. The element is gone from DOM so `document.querySelector('[data-sync-status]')` returns `null` — the function will already be silently safe. No change strictly required.

**`data-voice-status` selector:** Remove `const voiceStatus = …` and any lines that set `voiceStatus.textContent`.

**`data-alert-status` selector:** Remove `const alertStatus = …` and any lines that set `alertStatus.textContent`.

**Add `initWelcomePopup()` call** at the bottom of `initAiraChatbox()`.

---

## File Change Summary

| File | Change type | Lines affected (est.) |
|---|---|---|
| `src/index.tsx` | Remove 6 HTML elements, add popup HTML | ~15 removed, ~12 added |
| `public/static/style.css` | Remove 6 rule blocks, add popup styles | ~30 removed, ~40 added |
| `public/static/app.js` | Remove 5 DOM selectors + references, add `initWelcomePopup` | ~20 removed, ~25 added |

---

## Acceptance Criteria

- [ ] Welcome popup appears on fresh page load (no `aira-welcomed` in sessionStorage)
- [ ] Popup does NOT appear on second visit in the same browser session
- [ ] Clicking "Chat" in popup: popup disappears, chatbox opens in chat mode
- [ ] Clicking "Voice" in popup: popup disappears, chatbox opens in voice mode
- [ ] Chatbox contains no status/noise text in any state
- [ ] Book Demo link is visible inside chatbox at all times
- [ ] Talk to Human button is visible inside chatbox at all times
- [ ] WhatsApp and Telegram links are hidden until "Talk to Human" is clicked
- [ ] After clicking "Talk to Human", both links appear (existing behavior preserved)
- [ ] Central memory sync still runs silently (no visible change to user)
