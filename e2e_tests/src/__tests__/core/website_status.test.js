const assert = require('assert').strict;
const Common = require("@root/objects/common");
const {replaceWebsocket, waitForWSSubset} = require("@root/_utils/websocket");
const {setUp, tearDown, mobile_viewport} = require('@root/bootstrap');

let browser, context, page;

beforeEach(async () => {
    const out = await setUp(mobile_viewport);
    browser = out.browser;
    context = out.context;

    await context.addInitScript(replaceWebsocket);
    page = new Common(await context.newPage());
});

afterEach(async () => {
    await tearDown(browser);
});

test('It should send website_status on page start', async () => {
    await page.navigate();
    const message = await waitForWSSubset(page, {
        website_status: {
            site_status: "up",
        },
    });

    assert.ok(message.website_status.site_status === 'up', 'Could not receive website status');
});
