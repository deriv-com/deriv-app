import { test, expect } from '@playwright/test';
import { mock_residents_list, mock_states_list, mock_general, mock_loggedIn, setupMocks } from '@deriv/integration';

test.describe('Personal Details - Menu', () => {
    test('the navigation menu works', async ({ page, baseURL }) => {
        await setupMocks({
            baseURL,
            page,
            mocks: [mock_general, mock_loggedIn, mock_residents_list, mock_states_list],
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
