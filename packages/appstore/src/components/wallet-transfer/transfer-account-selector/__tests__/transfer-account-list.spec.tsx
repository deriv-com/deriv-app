import React from 'react';
import TransferAccountList from '../transfer-account-list';
import { render, screen } from '@testing-library/react';

jest.mock('../../wallet-transfer-tile/wallet-transfer-tile', () => jest.fn(() => <div>WalletTransferTile</div>));

describe('TransferAccountList', () => {
    let mocked_props: React.ComponentProps<typeof TransferAccountList>;

    beforeEach(() => {
        mocked_props = {
            is_mobile: false,
            selected_account: {
                account_type: 'wallet',
                balance: 100,
                currency: 'USD',
                display_currency_code: 'USD',
                gradient_class: 'wallet-card__usd-bg',
                icon: 'Icon',
                is_demo: false,
                loginid: 'CRW1000',
                shortcode: 'svg',
                type: 'fiat',
                active_wallet_icon: 'Wallet Icon',
            },
            setIsListModalOpen: jest.fn(),
            setSelectedAccount: jest.fn(),
            transfer_accounts: {
                trading_accounts: {
                    CR1000: {
                        account_type: 'trading',
                        balance: 10,
                        currency: 'USD',
                        display_currency_code: 'USD',
                        gradient_class: 'wallet-card__usd-bg',
                        icon: 'Icon',
                        is_demo: false,
                        loginid: '1',
                        shortcode: 'svg',
                        type: 'fiat',
                        active_wallet_icon: 'IcCurrencyUsd',
                    },
                    MTR2000: {
                        account_type: 'mt5',
                        balance: 10,
                        currency: 'USD',
                        display_currency_code: 'USD',
                        gradient_class: 'wallet-card__usd-bg',
                        icon: 'Icon',
                        is_demo: false,
                        loginid: '2',
                        shortcode: 'svg',
                        type: 'fiat',
                        active_wallet_icon: 'IcCurrencyUsd',
                    },
                },

                wallet_accounts: {
                    CRW1000: {
                        account_type: 'wallet',
                        balance: 10000,
                        currency: 'USD',
                        display_currency_code: 'USD',
                        gradient_class: 'wallet-card__usd-bg',
                        icon: 'Icon',
                        is_demo: false,
                        loginid: '3',
                        shortcode: 'svg',
                        type: 'fiat',
                        active_wallet_icon: 'IcCurrencyUsd',
                    },
                },
            },
            transfer_hint: 'Transfer hint',
            wallet_name: 'USD Wallet',
        };
    });

    it('Should render proper titles of transfer accounts', () => {
        render(<TransferAccountList {...mocked_props} />);

        expect(screen.getByText('Trading accounts linked with USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('Wallets')).toBeInTheDocument();
    });

    it('Should render proper amount of transfer accounts', () => {
        render(<TransferAccountList {...mocked_props} />);

        expect(screen.getAllByText('WalletTransferTile')).toHaveLength(3);
    });

    it('Should render transfer hint for Wallets account list', () => {
        mocked_props.transfer_accounts = { ...mocked_props.transfer_accounts, trading_accounts: {} };
        render(<TransferAccountList {...mocked_props} />);

        expect(screen.getByText('Transfer hint')).toBeInTheDocument();
    });
});
