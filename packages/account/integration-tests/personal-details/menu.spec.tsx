import { test, expect } from '@playwright/test';
import { DEFAULT_ACCOUNTS, mockGeneral, mockLoggedIn, setupMocks } from '@deriv/integration';

test.describe('Personal Details - Menu', () => {
    test('the navigation menu works', async ({ page, baseURL }) => {
        await setupMocks({
            baseURL,
            state: {
                accounts: DEFAULT_ACCOUNTS,
            },
            page,
            mocks: [mockGeneral, mockLoggedIn],
        });
        await page.goto(`${baseURL}/account/personal-details`);

        const personalDetailsLink = await page.getByRole('link', { name: 'Personal details' });
        const languagesLink = await page.getByRole('link', { name: 'Languages' });

        expect(await personalDetailsLink.getAttribute('aria-current')).toBe('page');
        expect(await languagesLink.getAttribute('aria-current')).not.toBe('page');

        await languagesLink.click();

        expect(await personalDetailsLink.getAttribute('aria-current')).not.toBe('page');
        expect(await languagesLink.getAttribute('aria-current')).toBe('page');
    });
});
