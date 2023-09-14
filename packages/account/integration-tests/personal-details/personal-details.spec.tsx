import { test, expect } from '@playwright/test';
import {
    mock_residents_list,
    mock_states_list,
    mock_general,
    mock_loggedIn,
    assertFormFieldValues,
    setupMocks,
} from '@deriv/integration';
import { Context } from '@deriv/integration/src/utils/mocks/mocks';

const mock_set_settings = (context: Context) => {
    if ('set_settings' in context.request) {
        context.response = {
            echo_req: context.request,
            msg_type: 'set_settings',
            req_id: context.req_id,
            set_settings: 1,
        };
    }
};

test.describe('Personal Details', () => {
    test('the initial render', async ({ page, baseURL }) => {
        await setupMocks({
            baseURL,
            page,
            mocks: [mock_general, mock_loggedIn, mock_residents_list, mock_states_list],
        });
        await page.goto(`${baseURL}/account/personal-details`);

        await assertFormFieldValues(page, {
            // Details
            'First name*': 'Jane',
            'Last name*': 'Smith',
            'Place of birth': '',
            'Date of birth*': '01-01-1980',
            Citizenship: 'Thailand',
            'Country of residence': 'Thailand',
            'Phone number*': '+66111111111',

            // Address
            'First line of address*': 'test',
            'Second line of address': '',
            'Town/City*': 'test',
            'State/Province (optional)': '',
            'Postal/ZIP code': '',

            // Email preference
            'Get updates about Deriv products, services and events.': 'on',
        });

        const submitButton = await page.getByRole('button', { name: 'Submit' }).first();
        expect(await submitButton.isEnabled()).toBe(false);
    });

    test('submitting the changed form', async ({ page, baseURL }) => {
        await setupMocks({
            baseURL,
            page,
            mocks: [mock_general, mock_loggedIn, mock_residents_list, mock_states_list, mock_set_settings],
        });
        await page.goto(`${baseURL}/account/personal-details`);

        const firstNameField = await page.getByLabel('First name*').first();
        await firstNameField.click();
        await firstNameField.fill('');
        await firstNameField.type('John');

        const submitButton = await page.getByRole('button', { name: 'Submit' }).first();
        expect(await submitButton.isEnabled()).toBe(true);
        submitButton.click();

        // Submit button turns into a green tick
        await page.waitForSelector('[data-testid=form-footer-container] button svg');
    });
});
