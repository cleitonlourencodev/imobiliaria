const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 51.5074, longitude: -0.1278 }); // London

  const errors = [];
  const messages = [];
  const tileUrls = [];
  const page = await context.newPage();

  page.on('pageerror', (e) => errors.push((e.message || '') + '\n' + (e.stack || '')));
  page.on('console', (m) => messages.push(m.type() + ': ' + m.text()));
  page.on('dialog', (d) => { messages.push('DIALOG(' + d.type() + '): ' + d.message()); d.dismiss(); });
  page.on('request', (req) => {
    const u = req.url();
    if (u.indexOf('tile.openstreetmap.org') > -1) tileUrls.push(u);
  });

  await page.goto('http://localhost:3000/mapa', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  const snapshot = () => {
    const c = document.querySelector('.leaflet-container');
    if (!c) return { noContainer: true };
    const keys = Object.getOwnPropertyNames(c).filter(k => k.toLowerCase().indexOf('leaflet') > -1 || k.toLowerCase().indexOf('map') > -1);
    // probe a few
    let centerProbe = null, zoomProbe = null;
    for (const k of ['_leaflet_map', '_leaflet_id', '_map', 'leafletMap']) {
      const v = c[k];
      if (v && typeof v.getCenter === 'function') { centerProbe = v.getCenter(); zoomProbe = v.getZoom(); }
    }
    for (const k of Object.getOwnPropertyNames(c)) {
      try {
        const v = c[k];
        if (v && typeof v === 'object' && typeof v.getCenter === 'function') { centerProbe = v.getCenter(); zoomProbe = v.getZoom ? v.getZoom() : null; }
      } catch (e) {}
    }
    return {
      keys,
      center: centerProbe ? { lat: centerProbe.lat, lng: centerProbe.lng } : null,
      zoom: zoomProbe,
    };
  };

  console.log('STATE BEFORE:', JSON.stringify(await page.evaluate(snapshot)));
  const tilesBefore = new Set(tileUrls);

  // Click floating "Minha Localização" button only
  const btn = await page.$('button[title="Minha Localização"]');
  if (btn) { await btn.click(); console.log('CLICKED floating "Minha Localização"'); } else { console.log('floating btn NOT FOUND'); }

  await page.waitForTimeout(6000);
  console.log('STATE AFTER:', JSON.stringify(await page.evaluate(snapshot)));

  const tilesAfter = new Set(tileUrls);
  const newTiles = [...tilesAfter].filter(t => !tilesBefore.has(t));
  console.log('TILE COUNT BEFORE:', tilesBefore.size);
  console.log('TILE COUNT AFTER:', tilesAfter.size);
  console.log('NEW TILES AFTER CLICK (first 15):');
  newTiles.slice(0, 15).forEach(t => console.log('  ', t));

  console.log('ERRORS:', JSON.stringify(errors, null, 2));
  console.log('MESSAGES (filtered):', JSON.stringify(messages.filter(m => !m.includes('React DevTools') && !m.includes('HMR')), null, 2));

  await browser.close();
})().catch((e) => { console.error('REPRO FAIL', e); process.exit(1); });
