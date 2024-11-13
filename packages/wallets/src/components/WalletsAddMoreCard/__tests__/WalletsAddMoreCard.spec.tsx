/* eslint-disable camelcase */
import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletsAddMoreCard from '../WalletsAddMoreCard';

type TGradientBackground = {
    children: React.ReactNode;
};

type TAddMoreCardBanner = {
    currency: string;
    is_added: boolean;
    is_crypto: boolean;
};

type TAddMoreCardContent = {
    currency: string;
};

jest.mock('../../WalletGradientBackground', () => ({
    WalletGradientBackground: ({ children }: TGradientBackground) => (
        <div data-testid='wallet-gradient-background'>{children}</div>
    ),
}));

jest.mock('../../WalletsAddMoreCardBanner', () => ({
    __esModule: true,
    default: ({ currency, is_added: isAdded, is_crypto: isCrypto }: TAddMoreCardBanner) => (
        <div data-testid='wallets-add-more-card-banner'>
            {currency} - {isAdded ? 'Added' : 'Not Added'} - {isCrypto ? 'Crypto' : 'Fiat'}
        </div>
    ),
}));

jest.mock('../../WalletsAddMoreCardContent', () => ({
    __esModule: true,
    default: ({ currency }: TAddMoreCardContent) => <div data-testid='wallets-add-more-card-content'>{currency}</div>,
}));

describe('WalletsAddMoreCard', () => {
    it('should render default component correctly with given props', () => {
        const currency = 'USD';
        const isAdded = false;
        const isCrypto = false;

        render(<WalletsAddMoreCard currency={currency} is_added={isAdded} is_crypto={isCrypto} />);

        expect(screen.getByTestId('wallet-gradient-background')).toBeInTheDocument();
        expect(screen.getByTestId('wallets-add-more-card-banner')).toHaveTextContent('USD - Not Added - Fiat');
        expect(screen.getByTestId('wallets-add-more-card-content')).toHaveTextContent('USD');
    });

    it('should render component with crypto currency', () => {
        const currency = 'BTC';
        const isAdded = true;
        const isCrypto = true;

        render(<WalletsAddMoreCard currency={currency} is_added={isAdded} is_crypto={isCrypto} />);

        expect(screen.getByTestId('wallet-gradient-background')).toBeInTheDocument();
        expect(screen.getByTestId('wallets-add-more-card-banner')).toHaveTextContent('BTC - Added - Crypto');
        expect(screen.getByTestId('wallets-add-more-card-content')).toHaveTextContent('BTC');
    });

    it('should handle missing currency by defaulting to USD', () => {
        const isAdded = false;
        const isCrypto = false;

        render(<WalletsAddMoreCard currency={undefined} is_added={isAdded} is_crypto={isCrypto} />);

        expect(screen.getByTestId('wallet-gradient-background')).toBeInTheDocument();
        expect(screen.getByTestId('wallets-add-more-card-banner')).toHaveTextContent('USD - Not Added - Fiat');
        expect(screen.getByTestId('wallets-add-more-card-content')).toHaveTextContent('');
    });
});
