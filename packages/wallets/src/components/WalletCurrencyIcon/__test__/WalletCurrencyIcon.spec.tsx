import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletCurrencyIcon, { defaultIconWidth, roundedIconWidth } from '../WalletCurrencyIcon';

describe('WalletCurrencyIcon', () => {
    it('renders the correct icon for a given currency', () => {
        render(<WalletCurrencyIcon currency='USD' />);
        const iconElement = screen.getByTestId('dt_wallet_currency_icon');
        expect(iconElement).toBeInTheDocument();
    });

    it('renders with rounded icons when rounded prop is true', () => {
        render(<WalletCurrencyIcon currency='USD' rounded />);
        const iconElement = screen.getByTestId('dt_wallet_currency_icon');
        expect(iconElement).toBeInTheDocument();
    });

    it('renders with default icons when rounded prop is false', () => {
        render(<WalletCurrencyIcon currency='BTC' />);
        const iconElement = screen.getByTestId('dt_wallet_currency_icon');
        expect(iconElement).toBeInTheDocument();
    });

    it('renders with the correct size when size prop is provided and rounded is true', () => {
        render(<WalletCurrencyIcon currency='BTC' rounded size='lg' />);
        const iconElement = screen.getByTestId('dt_wallet_currency_icon');
        expect(iconElement).toHaveAttribute('width', roundedIconWidth.lg.toString());
    });

    it('renders with the correct size when size prop is provided and rounded is false', () => {
        render(<WalletCurrencyIcon currency='BTC' rounded={false} size='lg' />);
        const iconElement = screen.getByTestId('dt_wallet_currency_icon');
        expect(iconElement).toHaveAttribute('width', defaultIconWidth.lg.toString());
    });

    it('renders with the correct size when size prop is provided for FIAT and rounded is false', () => {
        render(<WalletCurrencyIcon currency='USD' rounded={false} size='lg' />);
        const iconElement = screen.getByTestId('dt_wallet_currency_icon');
        expect(iconElement).toHaveAttribute('width', roundedIconWidth.lg.toString());
    });

    it('renders null if an unknown currency is being passed', () => {
        const { container } = render(<WalletCurrencyIcon currency='MYR' />);
        expect(container).toBeEmptyDOMElement();
    });
});
