require('dotenv').config();
const render = require('./tests/src/_utils/test_template');

module.exports = {
  config: "./tests/jest.config.json",
  rootDir: "tests",
  testTimeout: 200000,
  useTypeScript: false,
  createTemplate: ({ name }) => render(name),
}
