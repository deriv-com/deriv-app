import { mockGeneral, mockLoggedIn, setupMocks } from '@deriv/integration';
import { expect, test } from '@playwright/test';
import { mockBalance } from './mocks/mockBalance';
import { mockCryptoConfig } from './mocks/mockCryptoConfig';
import { mockGetAccountTypes } from './mocks/mockGetAccountTypes';
import { mockProposalOpenContract } from './mocks/mockProposalOpenContract';
import mockWalletsAuthorize, { DEFAULT_WALLET_ACCOUNTS } from './mocks/mockWalletsAuthorize';

test.describe('Wallets - Traders Hub', () => {
    test('render USD wallet balance', async ({ baseURL, page }) => {
        await setupMocks({
            baseURL,
            mocks: [
                mockGeneral,
                mockLoggedIn,
                mockWalletsAuthorize,
                mockGetAccountTypes,
                mockCryptoConfig,
                mockProposalOpenContract,
                mockBalance,
            ],
            page,
            state: {
                accounts: DEFAULT_WALLET_ACCOUNTS,
            },
        });
        await page.goto(`${baseURL}/`);

        const balanceContainer = await page.textContent('.wallets-balance__container');
        expect(balanceContainer).toContain('9,988,000.89 USD');
    });
});
