import { Page, expect } from '@playwright/test';

export const assertField = async (page: Page, label: string, value: string) => {
    const field = await page.getByLabel(label).first();
    expect(await field.inputValue()).toBe(value);
};
