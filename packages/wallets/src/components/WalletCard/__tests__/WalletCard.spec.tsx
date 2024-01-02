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
        landingCompanyName: 'SVG',
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
            landingCompanyName: 'SVG',
        };
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('should render the correct wallet card and gradient background for USD wallet', () => {
        render(
            <APIProvider>
                <WalletCard {...mockProps} />
            </APIProvider>
        );
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        const gradient = screen.getByTestId('dt_wallet_gradient_background');
        expect(gradient).toHaveClass('wallets-gradient--USD-mobile-card-light');
    });

    it('should render the correct wallet card and gradient background for BTC wallet', () => {
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
        const gradient = screen.getByTestId('dt_wallet_gradient_background');
        expect(gradient).toHaveClass('wallets-gradient--BTC-mobile-card-light');
    });

    it('should render the correct wallet card and gradient background for demo wallet', () => {
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
        const gradient = screen.getByTestId('dt_wallet_gradient_background');
        expect(gradient).toHaveClass('wallets-gradient--demo-mobile-card-light');
    });

    it('should show balance loader when balance is loading', () => {
        render(
            <APIProvider>
                <WalletCard {...mockProps} />
            </APIProvider>
        );
        const balanceLoader = screen.getByTestId('dt_wallet_card_balance_loader');
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

    it('should show the landing company name when provided', () => {
        render(
            <APIProvider>
                <WalletCard {...mockProps} />
            </APIProvider>
        );
        expect(screen.getByText('SVG')).toBeInTheDocument();
    });

    it('should show the icon with the correct size', () => {
        mockProps = {
            ...mockProps,
            iconSize: 'sm',
        };
        render(
            <APIProvider>
                <WalletCard {...mockProps} />
            </APIProvider>
        );
        const icon = screen.getByTestId('dt_wallet_card_icon');
        expect(icon).toHaveAttribute('width', '16');
    });
});
