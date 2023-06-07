import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TCoreStores } from '@deriv/stores/types';
import WalletTransferBlock from '../wallet-transfer-block';

const wallet_account: TCoreStores['client']['accounts'][0] = {
    balance: 10415.24,
    currency: 'USD',
    landing_company_shortcode: 'svg',
    is_virtual: 1,
    loginid: 'CRW12345',
};

jest.mock('./../../containers/currency-switcher-container', () => jest.fn(({ children }) => <div>{children}</div>));

describe('<WalletTransferBlock />', () => {
    it('Check balance', () => {
        render(<WalletTransferBlock wallet_account={wallet_account} />);
        const { currency } = wallet_account;

        const balance_title = screen.queryByText(`10,415.24 ${currency}`);

        expect(balance_title).toBeInTheDocument();
    });

    it('Check loginid', () => {
        render(<WalletTransferBlock wallet_account={wallet_account} />);
        const { loginid } = wallet_account;

        const loginid_title = screen.queryByText(String(loginid));

        expect(loginid_title).toBeInTheDocument();
    });
});
