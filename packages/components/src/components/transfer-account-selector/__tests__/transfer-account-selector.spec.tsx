import React from 'react';
import { render, screen, within } from '@testing-library/react';
import TransferAccountSelector from '../transfer-account-selector';
import userEvent from '@testing-library/user-event';

describe('TransferAccountSelector', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mocked_props: React.ComponentProps<typeof TransferAccountSelector> = {
        transfer_accounts: {
            accounts: [
                {
                    loginid: 'CR12345678',
                    label: 'MT5 Derived',
                    currency: 'usd',
                    balance: '100000',
                    icon: 'IcAppstoreMt5Test',
                    wallet_icon: 'IcCurrencyUsd',
                    jurisdiction: 'SVG',
                },
            ],
            Wallets: [
                {
                    loginid: 'CR00000000',
                    label: 'USD Wallet',
                    currency: 'usd',
                    balance: '100000',
                    wallet_icon: 'IcCurrencyUsd',
                    jurisdiction: 'SVG',
                },
                {
                    loginid: 'CR11111111',
                    label: 'BTC Wallet',
                    currency: 'btc',
                    balance: '10.00000000',
                    wallet_icon: 'IcCurrencyBtc',
                    jurisdiction: 'SVG',
                },
                {
                    loginid: 'CR22222222',
                    label: 'ETH Wallet',
                    currency: 'eth',
                    balance: '10.00000000',
                    wallet_icon: 'IcCurrencyEth',
                    jurisdiction: 'SVG',
                },
            ],
        },
        label: 'Transfer from',
        placeholder: 'Select an account or wallet',
        wallet_name: 'USD Wallet (SVG)',
    };

    it('Should render TransferAccountSelector component with label and placeholder', () => {
        render(<TransferAccountSelector {...mocked_props} />);

        expect(screen.getByText('Transfer from')).toBeInTheDocument();
        expect(screen.getByText('Select an account or wallet')).toBeInTheDocument();
    });

    it('Should open modal with accounts if the user clicked on TransferAccountSelector component', async () => {
        render(<TransferAccountSelector {...mocked_props} />);
        const el_account_selector = screen.getByTestId('dt_transfer-account-selector');

        userEvent.click(el_account_selector);

        expect(screen.getByText('Trading accounts linked with USD Wallet (SVG)')).toBeInTheDocument();
        expect(screen.getByText('Wallets')).toBeInTheDocument();
        expect(screen.getByText('MT5 Derived')).toBeInTheDocument();
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();
        expect(screen.getByText('ETH Wallet')).toBeInTheDocument();
    });

    it('Should show selected account in TransferAccountSelector component', async () => {
        render(<TransferAccountSelector {...mocked_props} />);
        const el_account_selector = screen.getByTestId('dt_transfer-account-selector');

        userEvent.click(el_account_selector);
        const el_btc_account = screen.getByTestId('dt_wallet_title_btc');
        userEvent.click(el_btc_account);

        expect(within(el_account_selector).getByText('BTC Wallet')).toBeInTheDocument();
        expect(within(el_account_selector).getByText('Balance: 10.00000000 BTC')).toBeInTheDocument();
    });
});
