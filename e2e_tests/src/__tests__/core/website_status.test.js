const Common = require('@root/objects/common');
const { replaceWebsocket, waitForWSSubset } = require('@root/_utils/websocket');
const default_context_config = require('@root/_config/context');

let p;

describe('Website status check', () => {
    beforeEach(async () => {
        await jestPlaywright.resetContext({
            ...default_context_config,
        });
        await context.addInitScript(replaceWebsocket);
        p = new Common(page);
    });

    afterEach(async () => {
        await p.close();
    });

    test('It should send website_status on page start', async () => {
        await p.navigate();
        const message = await waitForWSSubset(p, {
            website_status: {
                site_status: 'up',
            },
        });
        expect(message.website_status.site_status === 'up').toBe(true);
    });
});
