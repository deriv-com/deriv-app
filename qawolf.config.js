require('dotenv').config();

module.exports = {
  config: "node_modules/qawolf/js-jest.config.json",
  rootDir: "tests",
  testTimeout: 60000,
  useTypeScript: false,
  createTemplate: ({ name }) => {
    return `
const assert = require('assert').strict;
const qawolf = require('qawolf');
const {replaceWebsocket} = require('./_utils/websocket'); // TODO: Fix the path
const {setUp, tearDown, mobile_viewport} = require('./bootstrap'); // TODO: Fix the path
const Common = require('./objects/common'); // TODO: Fix the path

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
      await qawolf.create();
});
`;
  },
}
