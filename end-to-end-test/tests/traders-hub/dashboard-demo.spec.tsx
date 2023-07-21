import { test, expect } from '@playwright/test';
import { TRADERS_HUB_URL, switchAccountType } from '../../utils';

test.describe("Trader's Hub Dashboard", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(TRADERS_HUB_URL);
    });
    test('It should switch from Demo to Real', async ({ page }) => {
        await switchAccountType(page, 'Demo', 'Real');
        const get_deriv_account_button = await page.getByText('Get a Deriv account').first();
        expect(get_deriv_account_button).toBeDefined();
    });
});
