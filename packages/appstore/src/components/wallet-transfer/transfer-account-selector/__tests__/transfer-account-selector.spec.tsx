import React from 'react';
import TransferAccountSelector from '../transfer-account-selector';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

jest.mock('../transfer-account-list', () => jest.fn(() => <div>TransferAccountList</div>));
jest.mock('../../wallet-transfer-tile', () => jest.fn(() => <div>WalletTransferTile</div>));

describe('TransferAccountSelector', () => {
    let modal_root_el: HTMLDivElement, mocked_props: React.ComponentProps<typeof TransferAccountSelector>;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    beforeEach(() => {
        mocked_props = {
            is_mobile: false,
            is_wallet_name_visible: false,
            label: 'Transfer from',
            onSelectAccount: jest.fn(),
            placeholder: 'Placeholder',
            portal_id: 'modal_root',
            setIsWalletNameVisible: jest.fn(),
            transfer_accounts: {
                trading_accounts: {},
                wallet_accounts: {},
            },
            transfer_hint: 'Transfer hint',
            value: undefined,
            wallet_name: 'USD Wallet',
        };
    });

    it('Should render placeholder, if there is no selected account', () => {
        render(<TransferAccountSelector {...mocked_props} />);

        expect(screen.getByText('Transfer from')).toBeInTheDocument();
        expect(screen.getByText('Placeholder')).toBeInTheDocument();
        expect(screen.getByTestId('dt_chevron_icon')).toBeInTheDocument();
    });

    it('Should render WalletTransferTile if the account was selected', () => {
        mocked_props.value = {
            active_wallet_icon: 'Icon',
            display_currency_code: 'USD',
            account_type: 'wallet',
            balance: 100,
            currency: 'USD',
            gradient_class: 'wallet-card__usd-bg',
            is_demo: false,
            loginid: '12345678',
            shortcode: 'svg',
            type: 'fiat',
            icon: 'Wallet Icon',
        };
        render(<TransferAccountSelector {...mocked_props} />);

        expect(screen.getByText('Transfer from')).toBeInTheDocument();
        expect(screen.getByText('WalletTransferTile')).toBeInTheDocument();
        expect(screen.getByTestId('dt_chevron_icon')).toBeInTheDocument();
    });

    it('Should render account selector transfer tile with default values default', () => {
        render(<TransferAccountSelector {...mocked_props} />);

        expect(screen.getByText('Transfer from')).toBeInTheDocument();
        expect(screen.getByText('Placeholder')).toBeInTheDocument();
        expect(screen.getByTestId('dt_chevron_icon')).toBeInTheDocument();
    });

    it('Should render TransferAccountList when the user is clicking on Transfer selector', () => {
        render(<TransferAccountSelector {...mocked_props} />);

        const el_transfer_tile = screen.getByTestId('dt_transfer_account_selector');
        userEvent.click(el_transfer_tile);

        expect(screen.getByText('TransferAccountList')).toBeInTheDocument();
    });

    it('Should render proper label', () => {
        render(<TransferAccountSelector {...mocked_props} />);

        expect(screen.getByText('Transfer from')).toBeInTheDocument();
    });
});
