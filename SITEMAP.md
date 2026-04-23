# SGC Tech AI Landing Page — Sitemap

**Live Deployment:** https://2bdbd97d.webapp-64t.pages.dev  
**Status:** ✅ Production Live  
**Last Updated:** 2026-04-23

---

## 📋 Navigation Map

### Public Pages & Sections

#### **Homepage** `/`
Main landing page with all sections accessible via navigation or direct anchors.

| Section | Route | Purpose |
|---------|-------|---------|
| **Top** | `/` (default scroll) | Hero section, statistics, trust badges, Aira floating button |
| **Industries** | `/#industries` | 8 industry verticals (Healthcare, Finance, Retail, Manufacturing, Logistics, Education, Legal, Real Estate) |
| **Why SGC TECH AI** | `/#why` | 6 core value propositions with icon cards |
| **Pricing** | `/#pricing` | 3 pricing tiers (Starter $2,400/mo, Professional $7,900/mo, Enterprise Custom) |
| **Testimonials** | `/#testimonials` | Customer success stories (Meridian Logistics, Vertex Financial, Northwind Retail) |
| **Stories** | `/#stories` | Case studies and video content area |
| **FAQ** | `/#faq` | 6 frequently asked questions with expandable answers |

#### **Navigation Elements**
- **Book Demo** CTA: Redirects to https://app.cal.com/sgctech
- **Sign In**: https://scholarixglobal.com/web/login (external link)
- **Aira Floating Button**: Launches interactive chatbox on current page
  - Voice/Chat mode toggle
  - B2B sales assistant
  - Conversation history persisted
  - Human escalation to WhatsApp/Telegram

---

## 🔐 Admin Routes

### Protected Dashboard

| Route | Access | Purpose |
|-------|--------|---------|
| `/admin/aira-memory` | Token-protected | Admin dashboard for viewing all Aira conversations, lead scores, and session data |

**Access Control:**
- Optional `ADMIN_TOKEN` environment variable
- If set, requires one of:
  - Query param: `?token=YOUR_ADMIN_TOKEN`
  - HTTP header: `x-admin-token: YOUR_ADMIN_TOKEN`
- If not set, dashboard is public (recommended for dev only)

**Dashboard Features:**
- Session list (sortable by updated time, lead score, turns)
- Lead score tracking (0-100 scale based on buying signals)
- Conversation message count
- Company/role summary from detected context
- View full session detail (JSON export)
- Pagination with "Load more" cursor support
- Real-time refresh button

---

## 🔌 API Endpoints

### Aira Memory APIs (Session Storage)

#### `GET /api/aira/memory`
Retrieve stored conversation data for a session.

```bash
curl "https://2bdbd97d.webapp-64t.pages.dev/api/aira/memory?sessionId=USER_SESSION_ID"
```

**Query Parameters:**
- `sessionId` (required): Unique session identifier (string, max 128 chars)

**Response (Success):**
```json
{
  "ok": true,
  "data": {
    "sessionId": "uuid-...",
    "history": [{ "role": "user", "text": "..." }, ...],
    "events": [{ "type": "mode_switch", "data": {...} }, ...],
    "brainState": { "leadScore": 45, "profile": {...}, "lastIntent": "pricing" },
    "createdAt": "2026-04-23T10:15:00Z",
    "updatedAt": "2026-04-23T10:22:15Z"
  }
}
```

**Response (KV Not Yet Bound):**
```json
{
  "ok": false,
  "error": "AIRA_BRAIN_KV binding is missing",
  "pending": [
    "Create a Cloudflare KV namespace",
    "Bind it in wrangler.jsonc as AIRA_BRAIN_KV",
    "Deploy with the binding available in this environment"
  ]
}
```
**Status:** 503 (pending KV binding)

---

#### `POST /api/aira/memory`
Save or update conversation data for a session.

```bash
curl -X POST "https://2bdbd97d.webapp-64t.pages.dev/api/aira/memory" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "uuid-...",
    "history": [{ "role": "user", "text": "What is pricing?" }],
    "events": [{ "type": "message_sent", "text": "..." }],
    "brainState": {
      "leadScore": 45,
      "turns": 5,
      "lastIntent": "pricing",
      "profile": { "company": "Acme Corp", "role": "CTO" }
    }
  }'
```

**Body Parameters:**
- `sessionId` (required): string, 1-128 chars
- `history` (optional): array of messages (limited to last 120 stored)
- `events` (optional): array of interaction events (limited to last 300 stored)
- `brainState` (optional): object with lead context and scoring data

**Response (Success):**
```json
{
  "ok": true,
  "saved": true,
  "updatedAt": "2026-04-23T10:22:15Z"
}
```

**Storage Details:**
- KV TTL: 90 days
- Metadata indexed: updatedAt, leadScore, turns, messageCount
- Auto-deduplication: Replaces previous session data

**Status:** 503 (pending KV binding)

---

### Admin APIs (Conversation Review)

#### `GET /api/admin/aira/sessions`
List all stored Aira conversation sessions (paginated).

```bash
curl "https://2bdbd97d.webapp-64t.pages.dev/api/admin/aira/sessions?limit=20&token=ADMIN_TOKEN"
```

**Query Parameters:**
- `limit` (optional): Results per page, 1-50, default 20
- `cursor` (optional): Pagination cursor from previous response
- `detail` (optional): `true` to include full session JSON
- `token` (optional): Admin token if `ADMIN_TOKEN` is set

**Response (Success):**
```json
{
  "ok": true,
  "sessions": [
    {
      "sessionId": "uuid-...",
      "updatedAt": "2026-04-23T10:22:15Z",
      "leadScore": 65,
      "turns": 8,
      "messageCount": 12,
      "summary": {
        "company": "Acme Corp",
        "role": "CTO",
        "lastIntent": "integrations"
      },
      "detail": null
    }
  ],
  "cursor": "next_cursor_token",
  "listComplete": false
}
```

**Status:** 503 (pending KV binding)

---

#### `GET /api/admin/aira/session/:sessionId`
Retrieve full detail for a specific session (protected).

```bash
curl "https://2bdbd97d.webapp-64t.pages.dev/api/admin/aira/session/USER_SESSION_ID?token=ADMIN_TOKEN"
```

**Path Parameters:**
- `sessionId` (required): Session ID to fetch

**Response (Success):**
```json
{
  "ok": true,
  "sessionId": "uuid-...",
  "detail": {
    "sessionId": "uuid-...",
    "history": [
      { "role": "user", "text": "How fast can you deploy?" },
      { "role": "aira", "text": "Most clients go live in 30 days..." }
    ],
    "events": [
      { "type": "chatbox_opened", "timestamp": "2026-04-23T10:15:00Z" },
      { "type": "mode_switch", "from": "chat", "to": "voice", "timestamp": "..." }
    ],
    "brainState": {
      "leadScore": 65,
      "turns": 8,
      "profile": {
        "name": "John Smith",
        "company": "Acme Corp",
        "role": "CTO",
        "industry": "Manufacturing",
        "budget": "$50k-$100k/mo",
        "timeline": "Q3 2026",
        "toolStack": ["Salesforce", "Snowflake"]
      },
      "intents": ["pricing", "integration", "deployment", "timeline"],
      "lastIntent": "integrations"
    },
    "createdAt": "2026-04-23T10:15:00Z",
    "updatedAt": "2026-04-23T10:22:15Z"
  }
}
```

**Status:** 503 (pending KV binding)

---

## 🧠 Aira Chatbox Features

### Modes
- **Chat**: Text-based conversation
- **Voice**: Voice agent interaction (description mode, tap to "talk")

### Core Capabilities
- Multi-turn conversation with persistent memory
- Intent detection (pricing, booking, integrations, compliance, timeline, budget, etc.)
- Lead context extraction (company, role, industry, budget, tools, timeline)
- Lead scoring (0-100, increases with buying signals)
- Adaptive replies based on conversation context
- Human escalation to WhatsApp or Telegram
- Session UUID persistence across page reloads
- localStorage fallback when KV unavailable

### Quick Actions
- "Calculate ROI" → Pricing section
- "Schedule a call" → Book Demo (Cal.com)
- "Talk to a human" → Channel choice (WhatsApp/Telegram)

### Escalation Channels
- **WhatsApp**: Direct link to +971563905772
- **Telegram**: App deep-link with fallback to web

---

## 📊 Session Data Structure

### Lead Profile (brainState)
```json
{
  "name": "John Smith",
  "company": "Acme Corp",
  "role": "Chief Technology Officer",
  "industry": "Manufacturing",
  "budget": "$50k-$100k per month",
  "timeline": "Q3 2026",
  "toolStack": ["Salesforce", "Snowflake", "SAP"],
  "goals": "Automate RFQ processing"
}
```

### Lead Score Signals
- Budget mention: +30 points
- Timeline mention: +25 points
- Competitor tool mention: +20 points
- Company name mention: +15 points
- Booking action: +50 points
- Human escalation: +40 points

### Intent Types
- `pricing` — Questions about cost or tiers
- `booking` — Request to schedule demo
- `integrations` — Questions about system connectivity
- `compliance` — Security, SOC 2, GDPR, HIPAA
- `timeline` — Deployment speed or project timing
- `budget` — Budget allocation or ROI
- `capabilities` — Platform features
- `human` — Escalation request

---

## 🚀 Deployment & KV Setup

### Current Status
- ✅ UI deployed and live
- ✅ All routes defined
- ⏳ KV binding pending (APIs return 503)

### To Enable Full Features

**Step 1: Create KV Namespace**
```bash
wrangler kv:namespace create "AIRA_BRAIN_KV"
wrangler kv:namespace create "AIRA_BRAIN_KV" --preview
```

**Step 2: Update wrangler.jsonc**
```jsonc
[env.production]
kv_namespaces = [
  { binding = "AIRA_BRAIN_KV", id = "YOUR_KV_ID", preview_id = "YOUR_PREVIEW_ID" }
]
vars = {
  // ADMIN_TOKEN = "your-secure-token-here" (optional)
}
```

**Step 3: Deploy**
```bash
npm run deploy
```

### Optional: Admin Token Security
```jsonc
vars = {
  ADMIN_TOKEN = "secure-32-char-random-token"
}
```

After setting, admin dashboard requires: `/admin/aira-memory?token=YOUR_TOKEN`

---

## 📱 Responsive Breakpoints

| Device | Width | Optimization |
|--------|-------|--------------|
| Mobile | 320px-768px | Single-column, stacked cards, full-width forms |
| Tablet | 769px-1024px | 2-column layouts, optimized spacing |
| Desktop | 1025px+ | Multi-column grids, full hero visuals |

---

## 🎯 Key CTAs & Links

| CTA | Destination | Trigger |
|-----|-------------|---------|
| **Book Demo** | https://app.cal.com/sgctech | Hero, navbar, pricing cards, Aira button |
| **Sign In** | https://scholarixglobal.com/web/login | Navbar (external) |
| **Calculate ROI** | `/#pricing` | Hero section |
| **See How It Works** | `/#why` | Hero section |
| **Talk to Aira** | Chatbox launcher | Floating message button |
| **Talk to Human** | WhatsApp/Telegram choice | Chatbox "Talk to Human" button |

---

## 📞 Support & Contact

- **Sales/Demos**: https://app.cal.com/sgctech
- **Human Escalation**: +971563905772 (WhatsApp/Telegram)
- **Admin Dashboard**: `https://2bdbd97d.webapp-64t.pages.dev/admin/aira-memory`

---

## 🔗 External Resources

- **Live Site**: https://2bdbd97d.webapp-64t.pages.dev
- **Sign-In Portal**: https://scholarixglobal.com/web/login
- **Cal.com Booking**: https://app.cal.com/sgctech
- **GitHub Repo**: https://github.com/samanabran/sgc-tech-ai-landing

---

## 📝 Aira Assistant Data

**Aira Capabilities (8 core + 8 extended):**
1. Predict & simulate outcomes before action
2. Connect & integrate across 200+ systems
3. Pull & analyze data in real time
4. Generate leads and answer customer questions
5. Book appointments automatically
6. Trigger intelligent workflow automation 24/7
7. Track ROI with observability and tracing
8. Support regulated environments (SOC 2, GDPR, HIPAA-ready)

**Industries Supported:**
Healthcare, Finance, Retail & eCom, Manufacturing, Logistics, Education, Legal, Real Estate

**Security Posture:**
- SOC 2 Type II compliant
- GDPR ready
- HIPAA-eligible
- On-premise deployment available
- Private VPC options

---

## 🗺️ JSON Sitemap (SEO)

For search engines, all routes return 200 with proper meta tags. Use this structure for SEO crawlers:

```xml
https://2bdbd97d.webapp-64t.pages.dev/               (Priority: 1.0, changefreq: weekly)
https://2bdbd97d.webapp-64t.pages.dev/#industries    (Priority: 0.8, changefreq: monthly)
https://2bdbd97d.webapp-64t.pages.dev/#why           (Priority: 0.8, changefreq: monthly)
https://2bdbd97d.webapp-64t.pages.dev/#pricing       (Priority: 0.9, changefreq: monthly)
https://2bdbd97d.webapp-64t.pages.dev/#testimonials  (Priority: 0.7, changefreq: monthly)
https://2bdbd97d.webapp-64t.pages.dev/#stories       (Priority: 0.7, changefreq: weekly)
https://2bdbd97d.webapp-64t.pages.dev/#faq           (Priority: 0.7, changefreq: monthly)
https://2bdbd97d.webapp-64t.pages.dev/admin/aira-memory (Priority: 0.0, noindex)
```

---

**Last Verified:** 2026-04-23 — All routes live and responding
