import { test, expect } from '@playwright/test';

test.describe('Should signup and logged in, in the app', () => {
    test('Title should be "Trader | Deriv"', async ({ page }) => {
        await page.goto(process.env.APP_URL!);
        // now we are logged in to the app and ready to write tests
        await expect(page).toHaveTitle('Trader | Deriv');
    });
});
