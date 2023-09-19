import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WalletTransferBlock from '../wallet-transfer-block';
import { TWalletAccount } from 'Types';
import { StoreProvider, mockStore } from '@deriv/stores';

const wallet_account: TWalletAccount = {
    currency: 'USD',
    icon: '',
    balance: 10415.24,
    landing_company_name: 'svg',
    is_disabled: 0,
    is_virtual: 0,
    loginid: 'CRW10001',
    is_selected: false,
    is_demo: false,
    wallet_currency_type: '',
    is_malta_wallet: false,
    gradient_header_class: 'wallet-header__test',
    gradient_card_class: 'wallet-card__test',
    currency_config: undefined,
    linked_to: [{ loginid: 'CR1001', platform: 'dtrade' }],
    is_fiat_currency: true,
};

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useTradingAccountsList: jest.fn(() => ({
        data: [{ account_category: 'trading', currency: 'USD', balance: 1000, loginid: 'CR1001' }],
    })),
    useWalletsList: jest.fn(() => ({
        data: [
            {
                currency: 'USD',
                icon: '',
                balance: 10415.24,
                landing_company_name: 'svg',
                is_disabled: 0,
                is_virtual: 0,
                loginid: 'CRW10001',
                is_selected: false,
                is_demo: false,
                wallet_currency_type: '',
                is_malta_wallet: false,
                gradient_header_class: 'wallet-header__test',
                gradient_card_class: 'wallet-card__test',
                currency_config: undefined,
                linked_to: [{ loginid: 'CR1001', platform: 'dtrade' }],
                is_fiat_currency: true,
            },
        ],
    })),
}));

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
        const balance_title = screen.getByText(`1,000.00 ${currency}`);

        expect(balance_title).toBeInTheDocument();
    });

    it('Check loginid', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <WalletTransferBlock wallet_account={wallet_account} />
            </StoreProvider>
        );

        const loginid = wallet_account?.linked_to?.[0]?.loginid;
        const loginid_title = screen.getByText(loginid!);
        expect(loginid_title).toBeInTheDocument();
    });
});
