# AGENTS.md — SGC Tech AI Landing

**Quick facts**: Hono + Cloudflare Pages + TypeScript JSX (no React runtime). Entry: `src/index.tsx`. Build → `dist/`.

## Developer Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server (watch mode) |
| `npm run build` | Vite → `dist/` (Cloudflare Pages build) |
| `npm run preview` | `wrangler pages dev dist` (Cloudflare local) |
| `npm run deploy` | Build + deploy to Cloudflare Pages |
| `npm run test` | vitest (unit tests) |
| `npm run test:e2e` | Playwright e2e tests |
| `pm2 start ecosystem.config.cjs` | Run on sandbox (port 3000) |

## Routes

| Route | Handler |
|-------|--------|
| `/` | Main landing page — `src/index.tsx` |
| `/quote-builder` | Quote builder app — `src/routes/quote-builder.tsx` |
| `/api/aira/memory` | KV memory API (GET/POST) |
| `/api/aira/chat` | Proxy to `aira.tachimao.com` |
| `/api/admin/aira/sessions` | Admin: list all sessions |
| `/admin/aira-memory` | Admin dashboard UI |

## Infrastructure

- **Platform**: Cloudflare Pages
- **Framework**: Hono (native JSX, NOT React)
- **KV Namespace**: `AIRA_BRAIN_KV` — bound in `wrangler.jsonc` (id: `d5ab928d6e8142fc8f2fb84d1a59dfb4`)
- **Compatibility date**: `2026-04-13`

## Important Files

- `src/index.tsx` — Main app + all page sections (hero, industries, pricing, testimonials, FAQ, Aira chat)
- `src/renderer.tsx` — HTML shell (meta tags, fonts, favicon)
- `src/routes/quote-builder.tsx` — Quote builder page
- `public/static/style.css` — All CSS (~29KB) — glassmorphism, gradient borders, no Tailwind
- `public/static/app.js` — Interactions (scroll-reveal, magnetic buttons, chatbox)
- `src/data/quote-data.ts` — Industries, AI features, Odoo modules for quote builder
- `src/utils/pricing.ts` — Quote calculation logic

## Design System (verify before editing)

- **Background**: `#0b0e27` (navy-900) with radial mesh + noise
- **Primary accent**: `#00d9ff` (electric cyan)
- **Secondary accent**: `#0047ff` (tech blue)
- **Display font**: Space Grotesk (600/700) — loaded via Google Fonts in renderer.tsx
- **Body font**: Outfit (400/500) — loaded via Google Fonts in renderer.tsx
- **Mono font**: JetBrains Mono (labels, prices) — loaded via Google Fonts in style.css

**Anti-pattern compliance** (do NOT add):
- ❌ Satoshi font — replaced with Space Grotesk + Outfit
- ❌ Inter font — use Space Grotesk + Outfit
- ❌ Purple gradients — cyan/tech-blue only
- ❌ Centered hero — asymmetric grid
- ❌ Generic AI slop — brutalist type, mono labels, numbered sections

## Technical Notes

- **No React runtime** — uses Hono's built-in JSX (`jsxImportSource: "hono/jsx"`)
- **SSR at request time** — Cloudflare edge renders JSX, not client-side
- **Client interactions** — vanilla JS in `app.js` (no framework hydration)
- **CSS** — pure CSS with custom properties, not Tailwind

## Testing

- `tests/unit/` — vitest unit tests
- `tests/e2e/` — Playwright e2e tests
- `.playwright-browsers/` — cached browsers (safe to commit)

## URLs

- **Sandbox**: https://3000-irbjmooyeepkdfo4opz7l-ea026bf9.sandbox.novita.ai
- **Local**: http://localhost:3000 (via PM2)

## Superpowers Context

This repo uses the `superpowers` workflow patterns. Relevant sessions/files:
- `copilot.md` — Quote builder architecture (outdated reference, ignore)
- `docs/superpowers/plans/` — Active plans
- `docs/superpowers/specs/` — Active specs