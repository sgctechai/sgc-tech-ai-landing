# Aira Chatbox Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all noise text from the Aira chatbox and move the welcome message into a fullscreen popup overlay that opens the chatbox in Chat or Voice mode on dismiss.

**Architecture:** Three file edits only. The welcome popup is a fixed-position overlay driven by sessionStorage — shown once per session, dismissed by clicking Chat or Voice, which opens the chatbox in that mode. All removed elements are purely presentational; the underlying JS logic (central memory sync, voice recognition state machine) continues to run silently.

**Tech Stack:** Hono.js JSX (`src/index.tsx`), vanilla CSS (`public/static/style.css`), vanilla JS (`public/static/app.js`), Cloudflare Workers (deploy via `npm run deploy`)

---

## File Map

| File | What changes |
|---|---|
| `src/index.tsx` | Add popup HTML (lines 988–989), remove 6 noise elements (lines 1014–1069) |
| `public/static/style.css` | Remove 4 dead rule blocks (~lines 459–519), add popup CSS |
| `public/static/app.js` | Remove 4 dead selectors, update guard clause, remove `modeMessages`, strip 11 `.textContent` assignments, add `initWelcomePopup()` |

---

## Task 1 — HTML: add popup, remove noise elements

**Files:**
- Modify: `src/index.tsx:988-1069`

- [ ] **Step 1: Add welcome popup HTML before `.aira-chatbox`**

Find line 988 (`</main>`) in `src/index.tsx`. Insert the popup div immediately after it, before the existing `<div class="aira-chatbox"` block:

```tsx
      {/* Welcome popup — shown once per session, dismissed by picking Chat or Voice */}
      <div id="aira-welcome-popup" class="aira-welcome-overlay" aria-modal="true" role="dialog" aria-label="Welcome to SGC TECH AI">
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

- [ ] **Step 2: Remove `.aira-chat-welcome` paragraph**

In the chatbox body (around line 1014), remove this block entirely:

```tsx
            <p class="aira-chat-welcome">
              Welcome to SGC TECH AI. We help B2B teams cut operational cost, automate workflows, and deploy production AI in as little as 30 days.
            </p>
```

- [ ] **Step 3: Remove `.aira-mode-copy` paragraph**

Remove this block (around line 1023):

```tsx
            <p class="aira-mode-copy" data-mode-copy>
              Chat mode is active. Ask pricing, integrations, or use the quick actions below.
            </p>
```

- [ ] **Step 4: Remove `.aira-voice-status` paragraph from voice panel**

The voice panel (around line 1042–1047) currently looks like:

```tsx
            <div class="aira-voice-panel" data-voice-panel hidden>
              <button type="button" class="aira-voice-toggle" data-voice-toggle>
                Start Voice Conversation
              </button>
              <p class="aira-voice-status" data-voice-status aria-live="polite">Voice mode ready. Tap to start speaking.</p>
            </div>
```

Remove only the `<p class="aira-voice-status" ...>` line, leaving the `<div>` and button intact.

- [ ] **Step 5: Remove the three bottom noise paragraphs**

Around lines 1067–1069, remove all three lines:

```tsx
            <p class="aira-alert-status" data-alert-status aria-live="polite"></p>
            <p class="aira-recording-note">Conversation and AI memory are recorded in browser storage on this device.</p>
            <p class="aira-sync-note" data-sync-status aria-live="polite">Central memory sync: checking...</p>
```

- [ ] **Step 6: Commit**

```bash
git add src/index.tsx
git commit -m "feat: add welcome popup HTML, remove chatbox noise elements"
```

---

## Task 2 — CSS: remove dead rules, add popup styles

**Files:**
- Modify: `public/static/style.css:459-519`

- [ ] **Step 1: Remove `.aira-voice-status` rule block**

Find and remove this block (around line 459):

```css
.aira-voice-status {
  margin: 0;
  color: var(--gray-300);
  font-size: 0.84rem;
  line-height: 1.45;
}
```

- [ ] **Step 2: Remove `.aira-recording-note` rule block**

Find and remove (around line 491):

```css
.aira-recording-note {
  margin: 0;
  font-size: 0.74rem;
  color: var(--gray-400);
}
```

- [ ] **Step 3: Remove `.aira-sync-note` rule blocks**

Find and remove (around lines 497–505):

```css
.aira-sync-note {
  margin: 0;
  font-size: 0.72rem;
  color: var(--gray-500);
}

.aira-sync-note.ok { color: #83f8cf; }
.aira-sync-note.warn { color: #ffd089; }
.aira-sync-note.err { color: #ff9da2; }
```

- [ ] **Step 4: Remove the combined `.aira-chat-welcome / .aira-mode-copy / .aira-alert-status` block**

Find and remove (around lines 507–519):

```css
.aira-chat-welcome,
.aira-mode-copy,
.aira-alert-status {
  margin: 0;
  color: var(--gray-300);
  font-size: 0.92rem;
  line-height: 1.5;
}

.aira-alert-status {
  min-height: 1.2rem;
  color: #9be4ff;
}
```

- [ ] **Step 5: Add popup overlay CSS**

Append this block to the end of the `/* ---- AIRA Chatbox ---- */` section (or at the end of the file, before any footer comments):

```css
/* ---- Welcome popup overlay ---- */
.aira-welcome-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: airaOverlayIn 0.25s ease both;
}

.aira-welcome-overlay--exit {
  animation: airaOverlayOut 0.22s ease forwards;
}

@keyframes airaOverlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes airaOverlayOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}

.aira-welcome-card {
  background: #0d1130;
  border: 1px solid rgba(0, 217, 255, 0.25);
  border-radius: 16px;
  padding: 28px 24px 24px;
  width: min(340px, 100%);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 217, 255, 0.08);
  animation: airaCardIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes airaCardIn {
  from { transform: translateY(16px) scale(0.97); opacity: 0; }
  to   { transform: translateY(0) scale(1);       opacity: 1; }
}

.aira-welcome-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 0.5rem;
}

.aira-welcome-body {
  font-size: 0.88rem;
  color: var(--gray-300);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.aira-welcome-actions {
  display: flex;
  gap: 0.5rem;
}

.aira-welcome-btn {
  flex: 1;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s;
}

.aira-welcome-btn:hover { opacity: 0.88; }

.aira-welcome-chat {
  background: var(--cyan);
  color: #0a1628;
}

.aira-welcome-voice {
  background: rgba(255, 255, 255, 0.06);
  color: var(--gray-100);
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
}
```

- [ ] **Step 6: Commit**

```bash
git add public/static/style.css
git commit -m "feat: add welcome popup CSS, remove dead chatbox noise styles"
```

---

## Task 3 — JS: remove dead references, add initWelcomePopup

**Files:**
- Modify: `public/static/app.js:613-1217`

- [ ] **Step 1: Remove three dead DOM selectors**

In the selector block at the top of `initAiraChatbox` (lines 613–625), remove these three lines:

```js
    const modeCopy = root.querySelector('[data-mode-copy]');
```
```js
    const alertStatus = root.querySelector('[data-alert-status]');
```
```js
    const voiceStatus = root.querySelector('[data-voice-status]');
```

**Do NOT remove** `const syncStatus = root.querySelector('[data-sync-status]');`. The `setSyncStatus` function references this variable and already has a `if (!syncStatus) return` guard — keeping the declaration means it returns `null` at runtime (the element is gone from HTML), which is silently safe.

- [ ] **Step 2: Update the early-return guard clause**

The guard currently references `modeCopy`, `alertStatus`, and `voiceStatus`. Replace the entire guard block (line 627) with:

```js
    if (!launcher || !panel || !closeBtn || !modeBtns.length || !talkBtn || !alertLinksWrap || !alertWhatsapp || !alertTelegram || !chatLog || !chatForm || !chatInput || !voicePanel || !voiceToggleBtn) {
      return;
    }
```

- [ ] **Step 3: Remove `modeMessages` and `modeCopy.textContent` from `setMode`**

Find and remove the `modeMessages` constant (around line 1013):

```js
    const modeMessages = {
      chat: 'Chat mode is active. Ask pricing, integrations, or use the quick actions below.',
      voice: 'Voice mode is active. Tap Start Voice Conversation and speak naturally.',
    };
```

Then inside the `setMode` function (around line 1068), remove this single line:

```js
      modeCopy.textContent = modeMessages[mode] || modeMessages.chat;
```

- [ ] **Step 4: Remove `voiceStatus.textContent` assignments (8 lines)**

Find and remove each of these lines individually:

In `stopVoiceListening` (~line 1023):
```js
      voiceStatus.textContent = 'Voice mode ready. Tap to start speaking.';
```

In `startVoiceListening` (~line 1035):
```js
      voiceStatus.textContent = 'Listening... speak now.';
```

In `startVoiceListening` catch block (~line 1042):
```js
        voiceStatus.textContent = 'Could not start voice input. Please try again.';
```

In `setMode` (~line 1078):
```js
        voiceStatus.textContent = 'Voice is not supported in this browser. Please use Chat mode.';
```

In `recognition.onresult` (~line 1133):
```js
          voiceStatus.textContent = 'I did not catch that. Please try again.';
```

In `recognition.onresult` (~line 1136):
```js
        voiceStatus.textContent = 'Heard: "' + transcript + '"';
```

In `recognition.onerror` (~line 1144):
```js
        voiceStatus.textContent = 'Voice error detected. Please try again.';
```

In `recognition.onend` (~line 1152):
```js
          voiceStatus.textContent = 'Voice mode ready. Tap to continue speaking.';
```

- [ ] **Step 5: Remove `alertStatus.textContent` assignments (3 lines)**

In the `talkBtn` click handler (~line 1177):
```js
      alertStatus.textContent = 'Choose a channel to alert human support: WhatsApp or Telegram.';
```

In the `alertWhatsapp` click handler (~line 1182):
```js
      alertStatus.textContent = 'Opening WhatsApp with your handoff message.';
```

In the `alertTelegram` click handler (~line 1193):
```js
      alertStatus.textContent = 'Attempting Telegram. If app launch fails, web fallback will open.';
```

- [ ] **Step 6: Add `initWelcomePopup()` function and call**

Immediately before the closing `}` of `initAiraChatbox` (after the `fetchCentralMemory()` call at line ~1209), add:

```js
    function initWelcomePopup() {
      if (sessionStorage.getItem('aira-welcomed')) return;
      const overlay = document.getElementById('aira-welcome-popup');
      if (!overlay) return;
      overlay.querySelectorAll('[data-welcome-mode]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const mode = btn.getAttribute('data-welcome-mode');
          sessionStorage.setItem('aira-welcomed', '1');
          overlay.classList.add('aira-welcome-overlay--exit');
          overlay.addEventListener('animationend', function() { overlay.remove(); }, { once: true });
          setMode(mode);
          setOpen(true);
        });
      });
    }
    initWelcomePopup();
```

- [ ] **Step 7: Commit**

```bash
git add public/static/app.js
git commit -m "feat: add initWelcomePopup, strip dead DOM selector references"
```

---

## Task 4 — Smoke test

**Files:** none (verification only)

Run the dev server:

```bash
npm run dev
```

Then open `http://localhost:8787` in a browser (use a private/incognito window for a clean sessionStorage state).

- [ ] **Check 1 — Popup appears on fresh load**

The `.aira-welcome-overlay` should be visible on top of the page immediately. You should see "Welcome to SGC TECH AI" with Chat and Voice buttons.

- [ ] **Check 2 — Clicking "Chat" opens chatbox in chat mode**

Chat form (`aira-chat-form`) should be visible. Voice panel (`aira-voice-panel`) should be hidden. Chat/Voice toggle should show Chat as active.

- [ ] **Check 3 — Popup does not reappear on reload**

Reload the page (same tab / same incognito window). The popup should NOT appear. The chatbox launcher button should be visible without any overlay.

- [ ] **Check 4 — Clicking "Voice" opens chatbox in voice mode** (use a new incognito window to reset sessionStorage)

Open fresh incognito, load the page, click "Voice" in the popup. Chat form should be hidden. Voice toggle button should be visible.

- [ ] **Check 5 — No noise text visible anywhere in the chatbox**

Open the chatbox (click "Message Aira" launcher). Verify none of these appear:
- "Chat mode is active. Ask pricing…"
- "Voice mode ready. Tap to start speaking."
- "Conversation and AI memory are recorded…"
- "Central memory sync: checking…"
- "Attempting Telegram…"

- [ ] **Check 6 — Talk to Human flow still works**

Click "Talk to Human" inside the chatbox. WhatsApp and Telegram buttons should appear. Click each — WhatsApp/Telegram should open.

- [ ] **Check 7 — Book Demo still works**

Click "Book Demo" — should open the booking URL in a new tab.

- [ ] **Final commit**

```bash
git add -A
git commit -m "chore: verify chatbox redesign — all acceptance criteria pass"
```
