import { test, expect } from '@playwright/test';
import { DEFAULT_ACCOUNTS, mockGeneral, mockLoggedIn, setupMocks, assertField } from '@deriv/integration';
import { Context } from '@deriv/integration/src/utils/mocks/mocks';

const mockSetSettingsValid = (context: Context) => {
    if ('set_settings' in context.request) {
        context.response = {
            echo_req: context.request,
            msg_type: 'set_settings',
            req_id: context.req_id,
            set_settings: 1,
        };
    }
};

const mockSetSettingsInvalid = (context: Context) => {
    if ('set_settings' in context.request) {
        context.response = {
            echo_req: context.request,
            msg_type: 'set_settings',
            req_id: context.req_id,
            error: {
                code: 'InvalidPhone',
                message: 'Please enter a valid phone number, including the country code (e.g. +15417541234).',
            },
        };
    }
};

const fillField = async (page, label, value) => {
    const field = await page.getByLabel(label).first();
    await field.click();
    await field.fill('');
    await field.type(value);
};

test.describe('Personal Details', () => {
    test('the initial render', async ({ page, baseURL }) => {
        await setupMocks({
            baseURL,
            state: {
                accounts: DEFAULT_ACCOUNTS,
            },
            page,
            mocks: [mockGeneral, mockLoggedIn],
        });
        await page.goto(`${baseURL}/account/personal-details`);

        await assertField(page, 'First name*', 'Jane');
        await assertField(page, 'Last name*', 'Smith');
        await assertField(page, 'Place of birth', '');
        await assertField(page, 'Date of birth*', '01-01-1980');
        await assertField(page, 'Citizenship', 'Thailand');
        await assertField(page, 'Country of residence', 'Thailand');
        await assertField(page, 'Phone number*', '+66111111111');
        await assertField(page, 'First line of address*', 'test');
        await assertField(page, 'Second line of address', '');
        await assertField(page, 'Town/City*', 'test');
        await assertField(page, 'State/Province (optional)', '');
        await assertField(page, 'Postal/ZIP code', '');
        await assertField(page, 'Get updates about Deriv products, services and events.', 'on');

        const submitButton = await page.getByRole('button', { name: 'Submit' }).first();
        expect(await submitButton.isEnabled()).toBe(false);
    });

    test('submitting the changed form', async ({ page, baseURL }) => {
        await setupMocks({
            baseURL,
            state: {
                accounts: DEFAULT_ACCOUNTS,
            },
            page,
            mocks: [mockGeneral, mockLoggedIn, mockSetSettingsValid],
        });
        await page.goto(`${baseURL}/account/personal-details`);

        await fillField(page, 'First name*', 'John');
        await fillField(page, 'Last name*', 'Doe');
        await fillField(page, 'Citizenship', 'Malaysia');
        await fillField(page, 'Phone number*', '+66222222222');
        await fillField(page, 'First line of address*', '123 Main Street');
        await fillField(page, 'Second line of address', 'Suite 100');
        await fillField(page, 'Town/City*', 'Kuala Lumpur');
        await fillField(page, 'State/Province (optional)', 'WP');
        await fillField(page, 'Postal/ZIP code', '50000');

        const submitButton = await page.getByRole('button', { name: 'Submit' }).first();
        expect(await submitButton.isEnabled()).toBe(true);
        await submitButton.click();

        await page.waitForSelector('[data-testid=form-footer-container] button svg');
    });

    test('should show error message when submitting form with invalid phone number', async ({ page, baseURL }) => {
        await setupMocks({
            baseURL,
            page,
            mocks: [mockGeneral, mockLoggedIn, mockSetSettingsInvalid],
        });
        await page.goto(`${baseURL}/account/personal-details`);

        await fillField(page, 'Phone number*', '000000000');

        const submitButton = await page.getByRole('button', { name: 'Submit' }).first();
        expect(await submitButton.isEnabled()).toBe(true);
        await submitButton.click();

        await expect(page.getByText('Please enter a valid phone number')).toBeVisible();
    });
});
