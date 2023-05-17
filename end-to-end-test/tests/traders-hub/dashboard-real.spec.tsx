import { test, expect } from '@playwright/test';
import { TRADERS_HUB_URL, switchAccountType } from '../../utils';

test.describe("Trader's Hub Dashboard", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(TRADERS_HUB_URL);
        await switchAccountType(page, 'Demo', 'Real');
    });

    test('It should switch from Real to Demo', async ({ page }) => {
        await switchAccountType(page, 'Real', 'Demo');
        const demo_count = await page.getByText(/Demo/).count();
        expect(demo_count).toBeGreaterThanOrEqual(1);
    });

    test('It should have the regulator switcher for low risk and no regulator switcher for high risk', async ({
        page,
    }) => {
        const regulator_switcher = await page.getByText('Regulation:');
        if (process.env.RISK_LEVEL === 'low_risk') {
            expect(regulator_switcher).toBeDefined();
        } else {
            expect(regulator_switcher).toBeNull();
        }
    });

    test('It should switch to EU for low risk', async ({ page }) => {
        if (process.env.RISK_LEVEL === 'low_risk') {
            await page.getByText('EU', { exact: true }).first().click();
            expect(await page.locator('text=Multipliers trading platform.')).toBeDefined();
        }
    });
    test('It should show Non-EU content for low risk and EU content for high risk on load', async ({ page }) => {
        if (process.env.RISK_LEVEL === 'low_risk') {
            expect(await page.locator('text=Options and multipliers trading platform.')).toBeDefined();
        } else {
            expect(await page.locator('text=Multipliers trading platform.')).toBeDefined();
        }
    });
});
