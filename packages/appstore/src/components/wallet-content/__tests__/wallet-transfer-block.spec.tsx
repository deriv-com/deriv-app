import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WalletBalanceAndLoginid } from '../wallet-transfer-block';
import { TCoreStores } from '@deriv/stores/types';

const wallet_account: TCoreStores['client']['accounts'][0] = {
    balance: '10415.24',
    currency: 'USD',
    landing_company_shortcode: 'svg',
    is_virtual: 1,
    loginid: 'CRW12345',
};

// TODO: we have to change useStores() to useStore() in <CurrencySwitcherContainer /> in first to write tests for <WalletTransferBlock />

describe('<WalletTransferBlock />', () => {
    it('Check balance', () => {
        render(
            <WalletBalanceAndLoginid
                currency={wallet_account.currency || 'USD'}
                balance={wallet_account.balance || ''}
                loginid={wallet_account.loginid || ''}
            />
        );
        const { currency, balance } = wallet_account;

        const balance_title = screen.queryByText(`${balance} ${currency}`);

        expect(balance_title).toBeInTheDocument();
    });

    it('Check loginid', () => {
        render(
            <WalletBalanceAndLoginid
                currency={wallet_account.currency || 'USD'}
                balance={wallet_account.balance || ''}
                loginid={wallet_account.loginid || ''}
            />
        );
        const { loginid } = wallet_account;

        const loginid_title = screen.queryByText(String(loginid));

        expect(loginid_title).toBeInTheDocument();
    });
});
