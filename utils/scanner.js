const puppeteer = require('puppeteer');
const { parseResults } = require('./parser');

exports.runScan = async (url) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Timeout 30 seconds
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Inject axe-core
    await page.addScriptTag({
      path: require.resolve('axe-core')
    });

    // Run axe scan
    const axeResults = await page.evaluate(async () => {
      return await axe.run();
    });

    const parsed = parseResults(axeResults);
    return { success: true, ...parsed };

  } catch (err) {
    return { success: false, error: err.message };
  } finally {
    if (browser) await browser.close();
  }
};