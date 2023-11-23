import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './integration-tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'https://localhost:8443',
        ignoreHTTPSErrors: true,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },

    webServer: {
        command: 'npx -y local-web-server -p 8443 --spa index.html --https -d packages/core/dist',
        url: 'https://localhost:8443',
        reuseExistingServer: true,
        ignoreHTTPSErrors: true,
        stdout: 'ignore',
        stderr: 'pipe',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        /* Run tests for each of our packages from root of the project */
        {
            name: 'account',
            testDir: './packages/account/integration-tests',
        },
        {
            name: 'integration',
            testDir: './packages/integration/integration-tests',
        },
        {
            name: 'wallets',
            testDir: './packages/wallets/integration-tests',
        },
    ],
});
