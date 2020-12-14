require('dotenv').config();
const render = require('./e2e_tests/src/_utils/test_template');

module.exports = {
  config: "./e2e_tests/jest.config.json",
  rootDir: "e2e_tests",
  testTimeout: 200000,
  useTypeScript: false,
  createTemplate: ({ name }) => render(name),
}
