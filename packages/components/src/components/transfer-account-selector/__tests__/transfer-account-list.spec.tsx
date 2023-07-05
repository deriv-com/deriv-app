import React from 'react';
import Badge from '../../badge';
import TransferAccountList from '../transfer-account-list';
import { render, screen } from '@testing-library/react';

jest.mock('../../wallet-tile/wallet-tile', () => jest.fn(() => <div>Wallet Tile</div>));

describe('TransferAccountList', () => {
    let mocked_props: React.ComponentProps<typeof TransferAccountList>;

    beforeEach(() => {
        mocked_props = {
            is_mobile: false,
            selected_account: {
                account_type: 'wallet',
                balance: 100,
                currency: 'USD',
                gradient_class: '',
                is_demo: false,
                loginid: '12345678',
                shortcode: 'svg',
                type: 'fiat',
                wallet_icon: 'Wallet Icon',
            },
            setIsListModalOpen: jest.fn(),
            setSelectedAccount: jest.fn(),
            transfer_accounts: {
                accounts: [
                    {
                        account_type: 'trading',
                        balance: 10,
                        currency: 'USD',
                        gradient_class: '',
                        is_demo: false,
                        loginid: '1',
                        shortcode: 'svg',
                        type: 'fiat',
                        wallet_icon: 'IcCurrencyUsd',
                    },
                    {
                        account_type: 'mt5',
                        balance: 10,
                        currency: 'USD',
                        gradient_class: '',
                        is_demo: false,
                        loginid: '2',
                        shortcode: 'svg',
                        type: 'fiat',
                        wallet_icon: 'IcCurrencyUsd',
                    },
                ],
                wallets: [
                    {
                        account_type: 'wallet',
                        balance: 10000,
                        currency: 'USD',
                        gradient_class: '',
                        is_demo: false,
                        loginid: '3',
                        shortcode: 'svg',
                        type: 'fiat',
                        wallet_icon: 'IcCurrencyUsd',
                    },
                ],
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

        expect(screen.getAllByText('Wallet Tile').length).toBe(3);
    });

    it('Should render transfer hint for Wallets account list', () => {
        mocked_props.transfer_accounts = { ...mocked_props.transfer_accounts, accounts: [] };
        render(<TransferAccountList {...mocked_props} />);

        expect(screen.getByText('Transfer hint')).toBeInTheDocument();
    });
});
