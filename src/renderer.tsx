import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'

const SITE_ORIGIN = 'https://sgctech.ai'

const PAGE_META: Record<string, { title: string; description: string; ogTitle?: string }> = {
  '/': {
    title: 'SGC TECH AI — AI-Powered Cost Savings, Deployed in 30 Days',
    description: 'Enterprise AI that cuts costs by up to 63%. Production-ready AI agents, integrations, and workflows for modern businesses. Deployed in 30 days.',
    ogTitle: 'SGC TECH AI — Cut Costs. Optimize Operations. Ship AI in 30 Days.',
  },
  '/quote-builder': {
    title: 'Quote Builder — SGC TECH AI | Custom AI Implementation Pricing',
    description: 'Build your custom AI implementation quote. Transparent pricing, zero surprises, 30-day deployment. Configure AI features and ERP modules to get an instant estimate.',
    ogTitle: 'Quote Builder — Build Your Custom AI Implementation Package',
  },
  '/terms': {
    title: 'Terms of Service — SGC TECH AI',
    description: 'Terms of service for SGC TECH AI platform and services.',
  },
  '/privacy': {
    title: 'Privacy Policy — SGC TECH AI',
    description: 'SGC TECH AI privacy policy. Learn how we collect, use and protect your personal data.',
  },
  '/security': {
    title: 'Security — SGC TECH AI',
    description: 'SGC TECH AI security practices, data protection, and compliance information.',
  },
}

const DEFAULT_META = {
  title: 'SGC TECH AI — AI-Powered Cost Savings, Deployed in 30 Days',
  description: 'Enterprise AI that cuts costs by up to 63%. Production-ready AI agents, integrations, and workflows for modern businesses. Deployed in 30 days.',
  ogTitle: 'SGC TECH AI — Cut Costs. Optimize Operations. Ship AI in 30 Days.',
}

export const renderer = jsxRenderer(({ children }) => {
  const c = useRequestContext()
  const path = c.req.path.replace(/\/$/, '') || '/'
  const meta = PAGE_META[path] ?? DEFAULT_META
  const ogTitle = meta.ogTitle ?? meta.title
  const canonical = `${SITE_ORIGIN}${path === '/' ? '/' : path}`

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0b0e27" />
        <meta name="description" content={meta.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="SGC TECH AI" />
        <meta property="og:image" content={`${SITE_ORIGIN}/static/sgc-tech-logo.png`} />

        {/* Twitter / X Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={`${SITE_ORIGIN}/static/sgc-tech-logo.png`} />

        <title>{meta.title}</title>
        <link rel="icon" type="image/png" href="/static/sgc-tech-logo.png" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Outfit:wght@400;500&display=swap" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        {/* GSAP 3D animation engine + ScrollTrigger */}
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/Observer.min.js" defer></script>
        <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.4/dist/lenis.min.js" defer></script>
        {/* particles.js — vanilla library powering the hero background */}
        <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js" defer></script>
        {/* Main interaction layer - initializes after all libraries load */}
        <script src="/static/app.js" defer></script>
      </body>
    </html>
  )
})
