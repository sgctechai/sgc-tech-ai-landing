import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0b0e27" />
        <meta name="description" content="SGC TECH AI — Enterprise AI deployment in 14 days. Production-ready AI agents, integrations, and workflows for modern businesses." />
        <meta property="og:title" content="SGC TECH AI — Enterprise AI in 14 Days" />
        <meta property="og:description" content="Ship production-grade AI for your business in 14 days or less. Built for B2B enterprise." />
        <meta property="og:type" content="website" />
        <title>SGC TECH AI — Enterprise AI, Deployed in 14 Days</title>
        <link rel="icon" type="image/png" href="/static/sgc-tech-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        {/* particles.js — vanilla library powering the hero background */}
        <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js" defer></script>
        <script src="/static/app.js" defer></script>
      </body>
    </html>
  )
})
