import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WalletTransferBlock from '../wallet-transfer-block';
import { TWalletAccount } from 'Types';
import { StoreProvider, mockStore } from '@deriv/stores';

const wallet_account: TWalletAccount = {
    name: 'USD',
    currency: 'USD',
    icon: '',
    balance: 10415.24,
    icon_type: 'fiat',
    landing_company_name: 'svg',
    is_disabled: false,
    is_virtual: false,
    loginid: 'CRW10001',
};

jest.mock('./../../containers/currency-switcher-container', () => jest.fn(({ children }) => <div>{children}</div>));

const mockedRootStore = mockStore({
    modules: {
        cfd: {
            toggleCompareAccountsModal: jest.fn(),
        },
    },
});

describe('<WalletTransferBlock />', () => {
    it('Check balance', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletTransferBlock wallet_account={wallet_account} />
            </StoreProvider>
        );
        const { currency } = wallet_account;

        const balance_title = screen.getByText(`10,415.24 ${currency}`);

        expect(balance_title).toBeInTheDocument();
    });

    it('Check loginid', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletTransferBlock wallet_account={wallet_account} />
            </StoreProvider>
        );
        const { loginid } = wallet_account;

        const loginid_title = screen.getByText(String(loginid));

        expect(loginid_title).toBeInTheDocument();
    });
});
