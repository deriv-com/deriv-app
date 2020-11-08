require('dotenv').config();

module.exports = {
  config: "node_modules/qawolf/js-jest.config.json",
  rootDir: "tests",
  testTimeout: 60000,
  useTypeScript: false,
  createTemplate: ({ name, url }) => {
    return ` 
// const {setUp, tearDown} = require('../../bootstrap');
let browser, context

beforeAll(async () => {
    const out = await setUp();
    browser = out.browser;
    context = out.context;
});

afterAll(async () => {
    await tearDown(browser);
});

test("${name}", async () => {
      await qawolf.create("process.env.HOME_URL");
});
`
  },
}
