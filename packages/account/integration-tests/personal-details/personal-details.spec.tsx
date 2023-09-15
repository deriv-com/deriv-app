import { test, expect } from '@playwright/test';
import { mock_residents_list, mock_states_list, mock_general, mock_loggedIn, setupMocks } from '@deriv/integration';

test.describe('Personal Details', () => {
    test('it shows the current name', async ({ page, baseURL }) => {
        await setupMocks({
            baseURL,
            page,
            mocks: [mock_general, mock_loggedIn, mock_residents_list, mock_states_list],
        });
        await page.goto(`${baseURL}/account/personal-details`);
        const firstName = await page.getByLabel('First name*').first();
        expect(await firstName.inputValue()).toBe('Jane');
        const lastName = await page.getByLabel('Last name*').first();
        expect(await lastName.inputValue()).toBe('Smith');
        const dateOfBirth = await page.getByLabel('Date of birth*').first();
        expect(await dateOfBirth.inputValue()).toBe('01-01-1980');
        const citizenship = await page.getByLabel('Citizenship').first();
        expect(await citizenship.inputValue()).toBe('Thailand');
    });
});
