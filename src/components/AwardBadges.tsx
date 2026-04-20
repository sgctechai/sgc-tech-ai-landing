// Premium hexagonal award & compliance badges for the hero trust row.

import { BadgeG2, BadgeSoc, BadgeIso, BadgeGdpr, BadgeHipaa, BadgeGartner } from './Badges'

const badges = [
  { Icon: <BadgeG2 />,      name: 'G2',       sub: 'Leader',    season: 'Spring 2025',  color: '#ff6b6b' },
  { Icon: <BadgeSoc />,     name: 'SOC 2',    sub: 'Type II',   season: 'Certified',    color: '#00d9ff' },
  { Icon: <BadgeIso />,     name: 'ISO 27001', sub: 'Certified', season: '2022',         color: '#00d9ff' },
  { Icon: <BadgeGdpr />,    name: 'GDPR',     sub: 'Compliant', season: 'EU Ready',     color: '#7eeaff' },
  { Icon: <BadgeHipaa />,   name: 'HIPAA',    sub: 'Ready',     season: 'Healthcare',   color: '#7eeaff' },
  { Icon: <BadgeGartner />, name: 'Gartner',  sub: 'Cool Vendor',"season": "'24",       color: '#c084fc' },
]

export const AwardBadges = () => (
  <div class="award-badges reveal reveal-delay-4">
    <span class="award-badges-label">Awards &amp; Compliance</span>
    <div class="award-badges-grid">
      {badges.map((b) => (
        <div class="award-badge" style={`--badge-color: ${b.color}`} title={`${b.name} ${b.sub} — ${b.season}`}>
          <div class="award-badge-shell">
            <div class="award-badge-hex">
              <span class="award-badge-icon">{b.Icon}</span>
            </div>
            <div class="award-badge-shine"></div>
          </div>
          <span class="award-badge-name">{b.name}</span>
          <span class="award-badge-sub">{b.sub}</span>
        </div>
      ))}
    </div>
  </div>
)
