const Common = require('@root/objects/common');
const { replaceWebsocket, waitForWSSubset } = require('@root/_utils/websocket');
const { setUp, tearDown, mobile_viewport } = require('@root/bootstrap');
const path = require('path');

let browser, context, page;
jest.setTimeout(60000);
describe('Website status check', () => {
    beforeEach(async () => {
        const out = await setUp(mobile_viewport);
        browser = out.browser;
        context = await browser.newContext({
            recordVideo: { dir: path.resolve(process.env.E2E_ARTIFACT_PATH, 'website_status.test.js') },
            ignoreHTTPSErrors: true,
        });
        await context.addInitScript(replaceWebsocket);
        page = new Common(await context.newPage());
    });

    afterEach(async () => {
        await page.close();
        await context.close();
        await tearDown(browser);
    });

    test('It should send website_status on page start', async () => {
        await page.navigate();
        const message = await waitForWSSubset(page, {
            website_status: {
                site_status: 'up',
            },
        });
        expect(message.website_status.site_status === 'up').toBe(true);
    });
});
