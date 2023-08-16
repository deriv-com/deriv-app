import { test, expect } from '@playwright/test';
import setupMocks from '../../utils/mocks/mocks';
import mockGeneral from '../../mocks/general';
import mockLoggedIn from '../../mocks/auth';
import mockResidentsList from '../../mocks/location/residents_list';
import mockStatesList from '../../mocks/location/states_list';

test.describe('Personal Details', () => {
    test('it shows the current name', async ({ page, baseURL }) => {
        await setupMocks({
            baseURL,
            page,
            mocks: [mockGeneral, mockLoggedIn, mockResidentsList, mockStatesList],
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
