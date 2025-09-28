const { chromium } = require('playwright');
const fs = require('fs');

describe('Scenario 1: Simple Form Demo', () => {
  let browser, context, page;

  beforeAll(async () => {
    const capabilities = JSON.parse(fs.readFileSync('resolved-capabilities.json', 'utf8'));
    const username = process.env.LT_USERNAME;
    const accessKey = process.env.LT_ACCESS_KEY;

    browser = await chromium.connect({
      wsEndpoint: `wss://${username}:${accessKey}@cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
        JSON.stringify(capabilities)
      )}`
    });

    context = await browser.newContext();
    page = await context.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Validate message input/output', async () => {
    await page.goto(process.env.BASE_URL);
    await page.click('text=Simple Form Demo');
    expect(page.url()).toContain('simple-form-demo');

    const message = 'Welcome to LambdaTest';
    await page.fill('#user-message', message);
    await page.click('#showInput');
    const output = await page.textContent('#message');
    expect(output).toBe(message);
  });
});
