// Two alternating badge designs for SGC TECH AI hero trust row.
//
// SVG coordinate note:
//   viewBox = 192×192, CSS rendered size = 96px → scale = 0.5
//   To render text at X px: set SVG font-size = X × 2 (= X / 0.5)
//
// Variant 1 — Stamp  : serrated circular border, curved arc text
// Variant 2 — Award  : clean circle with tick marks, centered icon + text

// ─── Shared SVG math ─────────────────────────────────────────────────────────

function serratedPath(teeth = 40, cx = 96, cy = 96, outerR = 95, innerR = 86) {
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * 2 * Math.PI
    const r = i % 2 === 0 ? outerR : innerR
    const x = (Math.cos(a) * r + cx).toFixed(2)
    const y = (Math.sin(a) * r + cy).toFixed(2)
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return d + ' Z'
}

// Top arc: left→right over the top (sweep=1, clockwise)
function topArc(r: number, cx = 96, cy = 96) {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`
}

// Bottom arc: left→right under the bottom (sweep=0, counter-clockwise)
function bottomArc(r: number, cx = 96, cy = 96) {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}`
}

// Tick marks evenly spaced around a circle
function tickMarks(n: number, r: number, len: number, cx = 96, cy = 96) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI
    const x1 = (Math.cos(a) * r + cx).toFixed(2)
    const y1 = (Math.sin(a) * r + cy).toFixed(2)
    const x2 = (Math.cos(a) * (r - len) + cx).toFixed(2)
    const y2 = (Math.sin(a) * (r - len) + cy).toFixed(2)
    d += `M ${x1} ${y1} L ${x2} ${y2} `
  }
  return d
}

// ─── Badge data ───────────────────────────────────────────────────────────────

interface BadgeData {
  id: string
  title: string
  sub: string
  color: string
  icon: string       // inner SVG markup (paths/polygons)
  iconViewBox?: string
  variant: 'stamp' | 'award'
  level?: 'gold' | 'silver' | 'bronze' | 'platinum'
}

const levelGrad: Record<string, [string, string]> = {
  gold:     ['#f59e0b', '#d97706'],
  silver:   ['#94a3b8', '#64748b'],
  bronze:   ['#d97706', '#b45309'],
  platinum: ['#cbd5e1', '#94a3b8'],
}

const badges: BadgeData[] = [
  {
    id: 'g2',
    variant: 'stamp',
    title: 'G2 LEADER',
    sub: "Spring '25",
    color: '#ff6b6b',
    icon: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="none"/>`,
  },
  {
    id: 'soc2',
    variant: 'award',
    level: 'platinum',
    title: 'SOC 2',
    sub: 'Type II',
    color: '#00d9ff',
    icon: `<path d="M12 2L3 5v7c0 5 3.5 9 9 10 5.5-1 9-5 9-10V5z"/><path d="M9 12l2 2 4-4"/>`,
  },
  {
    id: 'iso',
    variant: 'stamp',
    title: 'ISO 27001',
    sub: 'Certified',
    color: '#7eeaff',
    icon: `<circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>`,
  },
  {
    id: 'gdpr',
    variant: 'award',
    level: 'gold',
    title: 'GDPR',
    sub: 'Compliant',
    color: '#7eeaff',
    icon: `<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none"/>`,
  },
  {
    id: 'hipaa',
    variant: 'stamp',
    title: 'HIPAA',
    sub: 'Certified',
    color: '#c084fc',
    icon: `<path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6z"/><path d="M9 11h6M12 8v6"/>`,
  },
  {
    id: 'gartner',
    variant: 'award',
    level: 'gold',
    title: 'GARTNER',
    sub: 'Cool Vendor',
    color: '#fbbf24',
    icon: `<path d="M6 20V10M12 20V4M18 20v-6"/><path d="M4 20h16"/>`,
  },
]

// ─── Stamp variant ────────────────────────────────────────────────────────────
// Serrated circle, curved arc text top + bottom, icon in center.

const StampBadge = ({ id, title, sub, color, icon, iconViewBox = '0 0 24 24' }: BadgeData) => {
  const tId = `t-${id}`, bId = `b-${id}`
  return (
    <div class="award-badge stamp-variant" style={`--bc:${color}`} title={`${title} — ${sub}`}>
      <svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <path id={tId} d={topArc(64)} fill="none" />
          <path id={bId} d={bottomArc(64)} fill="none" />
        </defs>

        {/* Serrated outer border */}
        <path d={serratedPath()} class="ab-serrated" />

        {/* Inner disc */}
        <circle cx="96" cy="96" r="79" class="ab-disc" />

        {/* Dashed inner ring */}
        <circle cx="96" cy="96" r="70" class="ab-ring" />

        {/* Title arc — top (font-size 20 = 10px at 96px render) */}
        <text font-family="'Satoshi',sans-serif" font-size="20" font-weight="700"
          letter-spacing="3" text-transform="uppercase" fill="currentColor" class="ab-color">
          <textPath href={`#${tId}`} startOffset="50%" textAnchor="middle">{title}</textPath>
        </text>

        {/* Sub arc — bottom (font-size 16 = 8px at 96px render) */}
        <text font-family="'JetBrains Mono',monospace" font-size="16" font-weight="500"
          letter-spacing="2" fill="currentColor" opacity="0.75" class="ab-color">
          <textPath href={`#${bId}`} startOffset="50%" textAnchor="middle">{sub}</textPath>
        </text>

        {/* Center icon (48×48 in SVG = 24px rendered) */}
        <g transform="translate(72,72)">
          <svg width="48" height="48" viewBox={iconViewBox}
            fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
            class="ab-color" innerHTML={icon} />
        </g>
      </svg>
    </div>
  )
}

// ─── Award variant ────────────────────────────────────────────────────────────
// Clean circle with tick marks, level ribbon, icon + text centered.

const AwardBadgeCard = ({ id, title, sub, color, icon, level = 'gold', iconViewBox = '0 0 24 24' }: BadgeData) => {
  const [c1, c2] = levelGrad[level]
  const gradId = `lg-${id}`
  return (
    <div class="award-badge award-variant" style={`--bc:${color}`} title={`${title} — ${sub}`}>
      <svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color={c1} />
            <stop offset="100%" stop-color={c2} />
          </linearGradient>
        </defs>

        {/* Outer ring with color glow */}
        <circle cx="96" cy="96" r="88" class="ab-disc" />
        <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" stroke-width="3" class="ab-color" opacity="0.5" />
        <circle cx="96" cy="96" r="80" fill="none" stroke="currentColor" stroke-width="1" class="ab-color" opacity="0.25" />

        {/* Tick marks (16 marks, every 22.5°) */}
        <path d={tickMarks(16, 88, 8)} stroke="currentColor" stroke-width="2" class="ab-color" opacity="0.4" />

        {/* Level ribbon pill at top */}
        <rect x="62" y="20" width="68" height="22" rx="11" fill={`url(#${gradId})`} />
        <text x="96" y="35.5" font-family="'Satoshi',sans-serif" font-size="13"
          font-weight="700" letter-spacing="1.5" text-anchor="middle" fill="#0b0e27">
          {(level ?? 'gold').toUpperCase()}
        </text>

        {/* Center icon */}
        <g transform="translate(72,54)">
          <svg width="48" height="48" viewBox={iconViewBox}
            fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
            class="ab-color" innerHTML={icon} />
        </g>

        {/* Title (font-size 22 = 11px rendered) */}
        <text x="96" y="122" font-family="'Satoshi',sans-serif" font-size="22"
          font-weight="700" letter-spacing="1" text-anchor="middle"
          fill="white">{title}</text>

        {/* Divider line */}
        <line x1="60" y1="131" x2="132" y2="131" stroke="currentColor" stroke-width="1"
          class="ab-color" opacity="0.4" />

        {/* Sub text (font-size 17 = 8.5px rendered) */}
        <text x="96" y="149" font-family="'JetBrains Mono',monospace" font-size="17"
          font-weight="500" letter-spacing="2" text-anchor="middle"
          fill="white" opacity="0.7">{sub}</text>
      </svg>
    </div>
  )
}

// ─── Row export ───────────────────────────────────────────────────────────────

export const AwardStamps = () => (
  <div class="award-stamps reveal reveal-delay-4">
    <span class="award-stamps-label">Awards &amp; Compliance</span>
    <div class="award-stamps-row">
      {badges.map((b) =>
        b.variant === 'stamp'
          ? <StampBadge {...b} />
          : <AwardBadgeCard {...b} />
      )}
    </div>
  </div>
)
