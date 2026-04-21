// Apply universal word-count timing formula to ALL text layers:
// duration = 1.0 + max(0, words - 2) * 0.4 seconds
// e.g. 2 words = 1.0s  |  5 words = 2.2s  |  8 words = 3.4s  |  10 words = 4.2s
const fs = require('fs');
const t = JSON.parse(fs.readFileSync('./public/sgcclaw-promo-template.json'));
const layers = t.composition.scenes[0].layers;
const fps = 30;
const fr = s => Math.round(s * fps);

function wordDuration(text) {
  const words = text.trim().replace(/\n/g, ' ').split(/\s+/).filter(Boolean).length;
  return 1.0 + Math.max(0, words - 2) * 0.4;
}

let changed = 0;
layers.filter(l => l.type === 'text').forEach(l => {
  const text = (l.props.text || '').replace(/\n/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const durS  = wordDuration(text);
  const oldDurS = (l.duration / fps).toFixed(2);
  l.duration = fr(durS);
  changed++;
  const fromS = (l.from / fps).toFixed(2);
  const endS  = ((l.from + l.duration) / fps).toFixed(2);
  console.log(
    l.id.padEnd(16),
    (words + 'w').padStart(4),
    ('was ' + oldDurS + 's').padStart(10),
    '->',
    (durS.toFixed(1) + 's').padStart(6),
    (' [' + fromS + 's–' + endS + 's]').padStart(16),
    '"' + text.slice(0, 50) + '"'
  );
});

fs.writeFileSync('./public/sgcclaw-promo-template.json', JSON.stringify(t, null, 2));
console.log('\nApplied formula to', changed, 'text layers.');
console.log('Formula: 1.0s base + (words-2) x 0.4s per extra word');
