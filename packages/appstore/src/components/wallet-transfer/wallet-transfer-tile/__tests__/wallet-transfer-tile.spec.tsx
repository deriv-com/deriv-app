import React from 'react';
import WalletTransferTile from '../wallet-transfer-tile';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    AppLinkedWithWalletIcon: jest.fn(() => <div>AppLinkedWithWalletIcon</div>),
    WalletIcon: jest.fn(() => <div>WalletIcon</div>),
}));

describe('WalletTransferTile', () => {
    let mocked_props: Required<React.ComponentProps<typeof WalletTransferTile>>;

    beforeEach(() => {
        mocked_props = {
            account: {
                account_type: 'trading',
                balance: 100,
                currency: 'USD',
                display_currency_code: 'USD',
                gradient_class: 'wallet-card__usd-bg',
                icon: 'Icon',
                is_demo: false,
                shortcode: 'svg',
                loginid: '12345678',
                type: 'fiat',
                active_wallet_icon: 'Wallet Icon',
            },
            className: 'classname',
            has_hover: false,
            icon_size: 'small',
            is_active: false,
            is_list_item: false,
            is_mobile: false,
            onClick: jest.fn(),
        };
    });

    it('Should render merged icon (App with Wallet)', () => {
        render(<WalletTransferTile {...mocked_props} />);

        expect(screen.getByText('AppLinkedWithWalletIcon')).toBeInTheDocument();
    });

    it('Should render single wallet icon, if there is wallet account type', () => {
        mocked_props.account = { ...mocked_props.account, account_type: 'wallet' };
        render(<WalletTransferTile {...mocked_props} />);

        expect(screen.getByText('WalletIcon')).toBeInTheDocument();
    });

    it('Should render jurisdiction in mobile view', () => {
        mocked_props.is_list_item = false;
        mocked_props.is_mobile = true;
        render(<WalletTransferTile {...mocked_props} />);

        expect(screen.getByText('SVG')).toBeInTheDocument();
    });

    it('Should render jurisdiction in desktop view', () => {
        mocked_props.is_list_item = true;
        render(<WalletTransferTile {...mocked_props} />);

        expect(screen.getByText('SVG')).toBeInTheDocument();
    });

    it('Should render proper account label', () => {
        render(<WalletTransferTile {...mocked_props} />);

        expect(screen.getByText('Deriv Apps')).toBeInTheDocument();
    });

    it('Should render proper account balance', () => {
        render(<WalletTransferTile {...mocked_props} />);

        expect(screen.getByText('Balance: 100.00 USD')).toBeInTheDocument();
    });

    it('Should trigger onClick callback when the user is clicking on Wallet tile', () => {
        render(<WalletTransferTile {...mocked_props} />);

        const el_wallet_tile = screen.getByTestId('dt_wallet_transfer_tile');
        userEvent.click(el_wallet_tile);

        expect(mocked_props.onClick).toHaveBeenCalledTimes(1);
    });
});
