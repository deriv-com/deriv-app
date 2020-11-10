const assert = require('assert').strict;
const Common = require("../../objects/common");
const {replaceWebsocket, waitForWSSubset} = require("../../_utils/websocket");
const {setUp, tearDown} = require('../../bootstrap');

let browser, context, page;

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

beforeEach(async () => {
    await context.addInitScript(replaceWebsocket);
    page = new Common(await context.newPage());
});

afterAll(async () => {
    await tearDown(browser);
});

test('It should send website_status on page start', async () => {
    await page.goto(process.env.HOME_URL, {waitUntil: "domcontentloaded"});
    const message = await waitForWSSubset(page, {
        website_status: {
            site_status: "up",
        },
    });

    assert.ok(message.website_status.site_status === 'up', 'Could not receive website status');
});
