import React from 'react';
import { render, screen } from '@testing-library/react';
import { WalletTile } from '../tile';
import userEvent from '@testing-library/user-event';

describe('WalletTile', () => {
    const mocked_props: React.ComponentProps<typeof WalletTile> = {
        account: {
            loginid: 'CR12345678',
            label: 'MT5 Derived',
            currency: 'usd',
            balance: '100000',
            icon: 'IcAppstoreMt5Test',
            wallet_icon: 'IcCurrencyUsd',
            jurisdiction: 'SVG',
        },
        icon: <span>Icon</span>,
        has_hover: false,
        is_active: false,
        is_mobile: false,
        onClick: jest.fn(),
    };

    it('Should render WalletTile component', () => {
        render(<WalletTile {...mocked_props} />);

        expect(screen.getByText('Icon')).toBeInTheDocument();
        expect(screen.getByText('MT5 Derived')).toBeInTheDocument();
        expect(screen.getByText('Balance: 100000 USD')).toBeInTheDocument();
        expect(screen.getByText('SVG')).toBeInTheDocument();
    });

    it('Should render WalletTile component in mobile view', () => {
        render(<WalletTile {...mocked_props} is_mobile />);

        expect(screen.getByText('Icon')).toBeInTheDocument();
        expect(screen.getByText('MT5 Derived')).toBeInTheDocument();
        expect(screen.getByText('Balance: 100000 USD')).toBeInTheDocument();
        expect(screen.getByText('SVG')).toBeInTheDocument();
    });

    it('Should have proper classes when WalletTile component has hover and is active', () => {
        render(<WalletTile {...mocked_props} has_hover is_active />);

        expect(screen.getByTestId('dt_wallet_title_usd')).toHaveClass('wallet-tile--hover wallet-tile--active');
    });

    it('Should trigger onClick callback', () => {
        render(<WalletTile {...mocked_props} />);

        const el_wallet_tile = screen.getByTestId('dt_wallet_title_usd');
        userEvent.click(el_wallet_tile);

        expect(mocked_props.onClick).toHaveBeenCalledTimes(1);
    });
});
