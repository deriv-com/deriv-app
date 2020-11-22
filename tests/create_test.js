const path = require('path');
const fs = require('fs');

const template = (name) => `const assert = require('assert').strict;
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

(async () => {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        throw new Error('Insufficient args. Please use node tests/create_test.js mobile|desktop test_name');
    }
    const test_name = `[${args[0]}]-${args[1]}`;
    const file_name = `tests/src/${args[0]}/${args[1]}.test.js`;
    const content = template(test_name);
    const target_dir = path.dirname(file_name);
    fs.mkdirSync(target_dir, { recursive: true });
    fs.writeFile(file_name, content, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
})();

