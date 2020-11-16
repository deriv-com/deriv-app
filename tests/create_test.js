const path = require('path');
const fs = require('fs');

const template = (name) => `const assert = require('assert').strict;
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
      await qawolf.create(); // writing tests.
});
`;

(async () => {
    const args = process.argv.slice(2);
    const test_name = `[${args[0]}]-${args[1]}`;
    const file_name = `tests/${args[0]}/${args[1]}.test.js`;
    const content = template(test_name);
    const target_dir = path.dirname(file_name);
    fs.mkdirSync(target_dir, { recursive: true });
    fs.writeFile(file_name, content, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
})();

