import { test, expect } from '@playwright/test';

test.describe('Should buy the contract correctly', () => {
    test('Should change the endpoint and sign up', async ({ page }) => {
        await page.goto(process.env.APP_URL!);
        // now we are logged in to the app and ready to test buu
        await expect(page).toHaveTitle('Trader | Deriv');
        // create a new user account and logged ©
        // session before running each test
    });
});
