import { IconArrow, IconMenu } from './Icons'

const BOOK_DEMO_URL = 'https://app.cal.com/sgctech'

/**
 * Shared navigation component used on all pages.
 * Links use absolute paths (/#section) so they work from sub-routes too.
 */
export const Nav = () => (
  <nav class="nav" aria-label="Primary">
    <div class="container nav-inner">
      <a href="/" class="nav-logo" aria-label="SGC TECH AI Home">
        <img src="/static/sgc-tech-logo.png" alt="SGC TECH AI" />
        <span>SGC <span style="color: var(--cyan)">TECH</span></span>
      </a>
      <ul class="nav-links" role="menubar">
        <li><a href="/#industries">Industries</a></li>
        <li><a href="/#why">Why SGC</a></li>
        <li><a href="/#pricing">Pricing</a></li>
        <li><a href="/#testimonials">Customers</a></li>
        <li><a href="/#stories">Stories</a></li>
        <li><a href="/#faq">FAQ</a></li>
        <li><a href="/quote-builder" class="nav-quote-link">Quote Builder</a></li>
        <li><a href="/download" class="nav-download-link">Download</a></li>
      </ul>
      <div class="nav-cta">
        <a
          href="https://scholarixglobal.com/web/login"
          class="btn btn-ghost"
          style="padding: 0.55rem 1.1rem;"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign in
        </a>
        <a
          href={BOOK_DEMO_URL}
          class="btn btn-primary"
          style="padding: 0.55rem 1.1rem;"
          data-magnetic
          target="_blank"
          rel="noopener noreferrer"
        >
          Book Demo <IconArrow />
        </a>
        <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">
          <IconMenu />
        </button>
      </div>
    </div>
  </nav>
)
