import { test, expect } from '@playwright/test';
import { checkPerformanceResults, enablePerformance, getPerformanceData } from '../../utils';

test.describe('Should signup and logged in, in the app', () => {
    let client;
    test.beforeEach(async ({ page, browser }) => {
        client = await enablePerformance(page, browser);
    });
    test.afterEach(async ({ browserName }, test_info) => {
        const performance_data = await getPerformanceData(browserName, client);
        const should_fail = await checkPerformanceResults(browserName, test_info.title, performance_data);
        expect(should_fail).toBeFalsy();
    });
    test('Title should be "Trader | Deriv"', async ({ page }) => {
        await page.goto(process.env.APP_URL!);
        // now we are logged in to the app and ready to write tests
        await expect(page).toHaveTitle('Trader | Deriv');
    });
});
