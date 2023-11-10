import { mock_general, mock_loggedIn, setupMocks } from '@deriv/integration';
import { expect, test } from '@playwright/test';
import { mock_balance } from '../mocks/mock_balance';
import { mock_crypto_config } from '../mocks/mock_crypto_config';
import { mock_get_account_types } from '../mocks/mock_get_account_types';
import { mock_proposal_open_contract } from '../mocks/mock_proposal_open_contract';
import mock_wallets_authorize, { DEFAULT_WALLET_ACCOUNTS } from '../mocks/mock_wallets_authorize';

test.describe('Wallets - Traders Hub', () => {
    test('render header', async ({ baseURL, page }) => {
        await setupMocks({
            baseURL,
            state: {
                accounts: DEFAULT_WALLET_ACCOUNTS,
            },
            mocks: [
                mock_general,
                mock_loggedIn,
                mock_wallets_authorize,
                mock_get_account_types,
                mock_crypto_config,
                mock_proposal_open_contract,
                mock_balance,
            ],
            page,
        });
        await page.goto(`${baseURL}/wallets`);

        await expect(page.getByText(`Trader's Hub`)).toBeVisible();
        await expect(page.getByText(`Cashier`)).toBeVisible();
    });
});
