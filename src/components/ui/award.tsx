// Award stamp component — ported from award.tsx to Hono JSX (no React, no Tailwind).
// Generates serrated-circle SVG stamps with curved text arcs.

function serratedPath(teeth = 40, cx = 96, cy = 96, outerR = 95, innerR = 87) {
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * 2 * Math.PI
    const r = i % 2 === 0 ? outerR : innerR
    const x = Math.cos(angle) * r + cx
    const y = Math.sin(angle) * r + cy
    d += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`
  }
  return d + ' Z'
}

function topArcPath(r: number, cx = 96, cy = 96) {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`
}

function bottomArcPath(r: number, cx = 96, cy = 96) {
  // Bottom arc: start right → left on lower half
  return `M ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx - r} ${cy}`
}

export interface StampBadgeProps {
  id: string
  title: string
  sub: string
  color?: string
  icon: string // inline SVG path(s) as string
  viewBox?: string
}

export const StampBadge = ({ id, title, sub, color = '#00d9ff', icon, viewBox = '0 0 24 24' }: StampBadgeProps) => {
  const topId = `tc-${id}`
  const botId = `bc-${id}`
  const clipId = `cl-${id}`

  return (
    <div class="stamp-badge" style={`--stamp-color: ${color}`}>
      <svg
        viewBox="0 0 192 192"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        class="stamp-svg"
      >
        <defs>
          <path id={topId} d={topArcPath(62)} fill="none" />
          <path id={botId} d={bottomArcPath(67)} fill="none" />
          <clipPath id={clipId}>
            <circle cx="96" cy="96" r="76" />
          </clipPath>
        </defs>

        {/* Outer serrated border */}
        <path d={serratedPath()} class="stamp-border" />

        {/* Inner filled disc */}
        <circle cx="96" cy="96" r="80" class="stamp-disc" />

        {/* Inner ring */}
        <circle cx="96" cy="96" r="73" class="stamp-ring" fill="none" />

        {/* Title on top arc */}
        <text class="stamp-arc-text">
          <textPath href={`#${topId}`} startOffset="50%" textAnchor="middle">
            {title}
          </textPath>
        </text>

        {/* Sub on bottom arc */}
        <text class="stamp-arc-text stamp-arc-sub">
          <textPath href={`#${botId}`} startOffset="50%" textAnchor="middle">
            {sub}
          </textPath>
        </text>

        {/* Center icon */}
        <g transform="translate(72, 72)" clip-path={`url(#${clipId})`}>
          <svg width="48" height="48" viewBox={viewBox} fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round" class="stamp-icon"
            innerHTML={icon}
          />
        </g>
      </svg>
      <span class="stamp-badge-label">{sub}</span>
    </div>
  )
}

// ── Industry-relevant stamps for SGC TECH AI ─────────────────────────────────
// Awards & compliance certs that matter most for enterprise AI buyers.

const stamps: StampBadgeProps[] = [
  {
    id: 'g2',
    title: 'G2 LEADER',
    sub: 'Spring 2025',
    color: '#ff6b6b',
    icon: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
    viewBox: '0 0 24 24',
  },
  {
    id: 'soc2',
    title: 'SOC 2 TYPE II',
    sub: 'Certified',
    color: '#00d9ff',
    icon: `<path d="M12 2L3 5v7c0 5 3.5 9 9 10 5.5-1 9-5 9-10V5z"/><path d="M9 12l2 2 4-4"/>`,
    viewBox: '0 0 24 24',
  },
  {
    id: 'iso',
    title: 'ISO 27001',
    sub: '2022 Certified',
    color: '#7eeaff',
    icon: `<circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>`,
    viewBox: '0 0 24 24',
  },
  {
    id: 'gdpr',
    title: 'GDPR READY',
    sub: 'EU Compliant',
    color: '#7eeaff',
    icon: `<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.2" fill="currentColor" stroke="none"/>`,
    viewBox: '0 0 24 24',
  },
  {
    id: 'hipaa',
    title: 'HIPAA READY',
    sub: 'Healthcare',
    color: '#c084fc',
    icon: `<path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6z"/><path d="M9 11h6M12 8v6"/>`,
    viewBox: '0 0 24 24',
  },
  {
    id: 'gartner',
    title: 'GARTNER',
    sub: "Cool Vendor '24",
    color: '#fbbf24',
    icon: `<path d="M6 20V10M12 20V4M18 20v-6"/><path d="M4 20h16"/>`,
    viewBox: '0 0 24 24',
  },
]

export const AwardStamps = () => (
  <div class="award-stamps reveal reveal-delay-4">
    <span class="award-stamps-label">Awards &amp; Compliance</span>
    <div class="award-stamps-row">
      {stamps.map((s) => <StampBadge {...s} />)}
    </div>
  </div>
)
