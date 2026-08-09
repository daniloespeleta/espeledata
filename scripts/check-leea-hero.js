const { chromium } = require('playwright');
const fs = require('fs');

async function capture() {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.goto('file:///C:/Users/espel/espeledata/leea.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/espel/Documents/Leea/leea-hero-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/espel/Documents/Leea/leea-hero-mobile.png' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('file:///C:/Users/espel/espeledata/portfolio.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/espel/Documents/Leea/leea-portfolio.png' });
  await page.goto('file:///C:/Users/espel/espeledata/case-leea.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/espel/Documents/Leea/leea-case.png' });
  await browser.close();
}

capture().catch((error) => { console.error(error); process.exit(1); });
