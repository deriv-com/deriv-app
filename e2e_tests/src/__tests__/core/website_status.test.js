const Common = require('@root/objects/common');
const { replaceWebsocket, waitForWSSubset } = require('@root/_utils/websocket');
const { tearDown } = require('@root/bootstrap');

let page;

describe('Website status check', () => {
    beforeEach(async () => {
        await context.addInitScript(replaceWebsocket);
        page = new Common(await context.newPage());
    });

    afterEach(async () => {
        await page.close();
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
