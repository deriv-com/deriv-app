import { Page } from '@playwright/test';

export const TRADERS_HUB_URL = `${process.env.APP_URL}/appstore/traders-hub`;

export const switchAccountType = async (page: Page, from_type: string, to_type: string) => {
    await Promise.all([
        page.waitForSelector('.account-type-dropdown--parent'),
        page.waitForSelector(`.account-type-dropdown--${from_type.toLowerCase()}`),
        page.getByTestId('dti_dropdown_display').getByText(from_type).click(),
        page.locator(`#${to_type.toLocaleLowerCase()}`).click(),
        page.waitForLoadState(),
    ]);
};
