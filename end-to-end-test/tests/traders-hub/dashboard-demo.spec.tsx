import { test, expect } from '@playwright/test';
import {
    TRADERS_HUB_URL,
    enablePerformance,
    getPerformanceData,
    checkPerformanceResults,
    switchAccountType,
} from '../../utils';

test.describe("Trader's Hub Dashboard", () => {
    let client;
    test.beforeEach(async ({ page, browser }) => {
        client = await enablePerformance(page, browser);
        await page.goto(TRADERS_HUB_URL);
    });
    test.afterEach(async ({ browserName }, test_info) => {
        const performance_data = await getPerformanceData(browserName, client);
        const should_fail = await checkPerformanceResults(browserName, test_info.title, performance_data);
        expect(should_fail).toBeFalsy();
    });
    test('It should switch from Demo to Real', async ({ page }) => {
        await switchAccountType(page, 'Demo', 'Real');
        const get_deriv_account_button = await page.getByText('Get a Deriv account').first();
        expect(get_deriv_account_button).toBeDefined();
    });
});
