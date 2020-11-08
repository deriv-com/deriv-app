const {setUp, tearDown} = require('../../bootstrap');
const {waitForWSMessage, replaceWebsocket} = require('../../_utils/websocket');

let browser, context;

beforeAll(async () => {
    const out = await setUp({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            'width': 375,
            'height': 667,
        },
        deviceScaleFactor: 2,
        hasTouch: true,
        defaultBrowserType: 'webkit',
    });
    browser = out.browser;
    context = out.context;
});

afterAll(async () => {
    await tearDown(browser);
});

test('It should send website_status on page start', async () => {
    await context.addInitScript(replaceWebsocket);
    const page = await context.newPage();
    await page.goto(process.env.HOME_URL, {waitUntil: "domcontentloaded"});
    await waitForWSMessage(page, 'website_status', {timeout: 20000});
});
