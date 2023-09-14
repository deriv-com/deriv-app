import { Page, expect } from '@playwright/test';

type FormFields = {
    [fieldLabel: string]: string;
};

export async function assertFormFieldValues(page: Page, formFields: FormFields) {
    const labels = Object.keys(formFields);
    const promises = labels.map(async label => {
        const field = await page.getByLabel(label).first();
        expect(await field.inputValue()).toBe(formFields[label]);
    });
    await Promise.all(promises);
}
