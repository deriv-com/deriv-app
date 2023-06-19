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
                balance: '100',
                currency: 'USD',
                icon: 'Icon',
                jurisdiction: <Badge type='bordered' label='SVG' />,
                label: 'Account Label',
                loginid: '12345678',
                type: 'fiat',
                wallet_icon: 'Wallet Icon',
                wallet_name: 'USD Wallet',
            },
            setIsListModalOpen: jest.fn(),
            setSelectedAccount: jest.fn(),
            transfer_accounts: {
                accounts: [
                    {
                        loginid: '1',
                        label: 'Deriv Apps',
                        currency: 'USD',
                        balance: '10.00',
                        wallet_icon: 'IcCurrencyUsd',
                        icon: 'IcDerivApps',
                        jurisdiction: <Badge type='bordered' label='SVG' />,
                        type: 'fiat',
                    },
                    {
                        loginid: '2',
                        label: 'MT5 Derived',
                        currency: 'USD',
                        balance: '10.00',
                        wallet_icon: 'IcCurrencyUsd',
                        icon: 'IcMT5Derived',
                        jurisdiction: <Badge type='bordered' label='SVG' />,
                        type: 'fiat',
                    },
                ],
                wallets: [
                    {
                        loginid: '3',
                        label: 'USD Wallet',
                        currency: 'USD',
                        balance: '10,000.00',
                        wallet_icon: 'IcCurrencyUsd',
                        jurisdiction: <Badge type='bordered' label='SVG' />,
                        type: 'fiat',
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
