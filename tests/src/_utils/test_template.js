module.exports = name => `const assert = require('assert').strict;
const qawolf = require('qawolf');
const {replaceWebsocket} = require('@root/_utils/websocket'); // TODO: Fix the path
const {setUp, tearDown, mobile_viewport} = require('@root/bootstrap'); // TODO: Fix the path
const Common = require('@root/objects/common'); // TODO: Fix the path

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

test("${name}", async () => {
      await page.navigate(); 
      await qawolf.create(); // writing tests.
});
`;
