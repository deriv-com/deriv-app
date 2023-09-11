import { Page } from '@playwright/test';

export const switchAccountType = async (page: Page, from_type: string, to_type: string) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('.account-type-dropdown--parent', { timeout: 0 });
    await page.waitForSelector(`.account-type-dropdown--${from_type.toLowerCase()}`, { timeout: 0 });
    await page.getByTestId('dti_dropdown_display').getByText(from_type).click({ timeout: 0 });
    await page.locator(`#${to_type.toLocaleLowerCase()}`).click();
    await page.waitForLoadState('domcontentloaded');
};
