import React, { ComponentProps } from 'react';
import { APIProvider, useBalance } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import WalletCard from '../WalletCard';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useBalance: jest.fn(),
}));

describe('WalletCard', () => {
    let mockProps: ComponentProps<typeof WalletCard> = {
        balance: '100 USD',
        currency: 'USD',
        iconSize: 'lg',
        landingCompanyName: 'Deriv',
    };
    beforeEach(() => {
        jest.clearAllMocks();
        (useBalance as jest.Mock).mockImplementation(() => ({
            ...jest.requireActual('@deriv/api').useBalance(),
            isLoading: true,
        }));
        mockProps = {
            balance: '100 USD',
            currency: 'USD',
            iconSize: 'lg',
            landingCompanyName: 'Deriv',
        };
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('should render wallet card for USD wallet', () => {
        render(
            <APIProvider>
                <WalletCard {...mockProps} />
            </APIProvider>
        );
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        const gradient = screen.getByTestId('dt_wallet-gradient-background');
        expect(gradient).toHaveClass('wallets-gradient--USD-mobile-card-light');
    });

    it('should render wallet card for BTC wallet', () => {
        mockProps = {
            balance: '100 BTC',
            currency: 'BTC',
            landingCompanyName: 'Deriv',
        };
        render(
            <APIProvider>
                <WalletCard {...mockProps} />
            </APIProvider>
        );
        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();
        const gradient = screen.getByTestId('dt_wallet-gradient-background');
        expect(gradient).toHaveClass('wallets-gradient--BTC-mobile-card-light');
    });

    it('should render wallet card for demo wallet', () => {
        mockProps = {
            balance: '100 USD',
            currency: 'USD',
            isDemo: true,
            landingCompanyName: 'Deriv',
        };
        render(
            <APIProvider>
                <WalletCard {...mockProps} />
            </APIProvider>
        );
        const gradient = screen.getByTestId('dt_wallet-gradient-background');
        expect(gradient).toHaveClass('wallets-gradient--demo-mobile-card-light');
    });

    it('should show balance loader when balance is loading', () => {
        render(
            <APIProvider>
                <WalletCard {...mockProps} />
            </APIProvider>
        );
        const balanceLoader = screen.getByTestId('dt_wallet-card-balance-loader');
        expect(balanceLoader).toBeInTheDocument();
    });

    it('should show balance when balance is loaded', () => {
        (useBalance as jest.Mock).mockImplementation(() => ({
            ...jest.requireActual('@deriv/api').useBalance(),
            isLoading: false,
        }));
        render(
            <APIProvider>
                <WalletCard {...mockProps} />
            </APIProvider>
        );
        expect(screen.getByText('100 USD')).toBeInTheDocument();
    });
});
