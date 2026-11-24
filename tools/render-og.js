// Renders tools/og.html to the share image. Run from the repo root: node tools/render-og.js
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2] || 'og-ajmal.jpg';
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.resolve(__dirname, 'og.html'), { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  await p.screenshot({ path: out, type: 'jpeg', quality: 86 });
  await b.close();
  console.log('wrote', out);
})();
