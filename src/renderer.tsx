import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0b0e27" />
        <meta name="description" content="SGC TECH AI — Enterprise AI that cuts costs by up to 63%. Production-ready AI agents, integrations, and workflows for modern businesses. Deployed in 30 days." />
        <meta property="og:title" content="SGC TECH AI — Cut Costs. Optimize Operations. Ship AI in 30 Days." />
        <meta property="og:description" content="Deploy production-grade AI that reduces operational costs by up to 63%. Built for B2B enterprise. Live in 30 days." />
        <meta property="og:type" content="website" />
        <title>SGC TECH AI — AI-Powered Cost Savings, Deployed in 30 Days</title>
        <link rel="icon" type="image/png" href="/static/sgc-tech-logo.png" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        <script src="https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js" defer></script>
        {/* particles.js — vanilla library powering the hero background */}
        <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js" defer></script>
        {/* Main interaction layer - initializes after all libraries load */}
        <script src="/static/app.js" defer></script>
      </body>
    </html>
  )
})
