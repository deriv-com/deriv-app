require('core-js/stable');
require('regenerator-runtime/runtime');

// Don't wait for more than 1 minute for each test case
// Unless it has changed locally in specific test file
jest.setTimeout(process.env.TEST_TIMEOUT || 60000);
