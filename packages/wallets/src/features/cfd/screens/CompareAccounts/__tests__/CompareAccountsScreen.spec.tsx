import React from 'react';
import { useActiveWalletAccount, useCFDCompareAccounts, useIsEuRegion } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import CompareAccountsScreen from '../CompareAccountsScreen';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
    useCFDCompareAccounts: jest.fn(),
    useIsEuRegion: jest.fn(),
}));

jest.mock('../../../components', () => ({
    CompareAccountsCarousel: ({ children }: React.PropsWithChildren) => <div data-testid='carousel'>{children}</div>,
}));

jest.mock('../CompareAccountsCard', () => ({
    __esModule: true,
    default: ({ marketType, platform, shortCode }: { marketType: string; platform: string; shortCode: string }) => (
        <div data-testid={`card-${marketType}-${platform}-${shortCode}`} />
    ),
}));

jest.mock('../CompareAccountsHeader', () => ({
    __esModule: true,
    default: () => <div data-testid='header' />,
}));

describe('CompareAccountsScreen', () => {
    const mockMT5Accounts = [
        { market_type: 'financial', platform: 'mt5', product: 'standard', shortcode: 'SVG' },
        { market_type: 'synthetic', platform: 'mt5', product: 'standard', shortcode: 'BVI' },
    ];

    const mockCTraderAccount = { market_type: 'financial', platform: 'ctrader', shortcode: 'SVG' };
    const mockDxtradeAccount = { market_type: 'financial', platform: 'dxtrade', shortcode: 'SVG' };

    beforeEach(() => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_malta_wallet: false, is_virtual: false },
        });

        (useCFDCompareAccounts as jest.Mock).mockReturnValue({
            data: {
                ctraderAccount: mockCTraderAccount,
                dxtradeAccount: mockDxtradeAccount,
                mt5Accounts: mockMT5Accounts,
            },
            hasCTraderAccountAvailable: true,
            hasDxtradeAccountAvailable: true,
        });
        (useIsEuRegion as jest.Mock).mockReturnValue(() => ({
            data: false,
            isLoading: false,
        }));
    });

    it('renders default components correctly', () => {
        render(<CompareAccountsScreen />);

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('carousel')).toBeInTheDocument();
    });

    it('renders MT5 and other available account cards correctly', () => {
        render(<CompareAccountsScreen />);

        expect(screen.getByTestId('card-financial-mt5-SVG')).toBeInTheDocument();
        expect(screen.getByTestId('card-synthetic-mt5-BVI')).toBeInTheDocument();
        expect(screen.getByTestId('card-financial-ctrader-SVG')).toBeInTheDocument();
        expect(screen.getByTestId('card-financial-dxtrade-SVG')).toBeInTheDocument();
    });

    it('does not render zero spread accounts', () => {
        (useCFDCompareAccounts as jest.Mock).mockReturnValue({
            data: {
                ctraderAccount: mockCTraderAccount,
                dxtradeAccount: mockDxtradeAccount,
                mt5Accounts: [
                    ...mockMT5Accounts,
                    { market_type: 'financial', platform: 'mt5', product: 'zero_spread', shortcode: 'SVG' },
                ],
            },
            hasCTraderAccountAvailable: true,
            hasDxtradeAccountAvailable: true,
        });

        render(<CompareAccountsScreen />);

        expect(screen.queryByTestId('card-financial-mt5-SVG-zero_spread')).not.toBeInTheDocument();
    });

    it('does not render MT5 cards when not available', () => {
        (useCFDCompareAccounts as jest.Mock).mockReturnValue({
            data: {
                ctraderAccount: mockCTraderAccount,
                dxtradeAccount: mockDxtradeAccount,
                mt5Accounts: undefined,
            },
        });

        render(<CompareAccountsScreen />);

        expect(screen.queryByTestId('card-financial-mt5-SVG')).not.toBeInTheDocument();
        expect(screen.queryByTestId('card-synthetic-mt5-BVI')).not.toBeInTheDocument();
    });

    it('does not render cTrader card when not available', () => {
        (useCFDCompareAccounts as jest.Mock).mockReturnValue({
            data: {
                ctraderAccount: null,
                dxtradeAccount: mockDxtradeAccount,
                mt5Accounts: mockMT5Accounts,
            },
            hasCTraderAccountAvailable: false,
            hasDxtradeAccountAvailable: true,
        });

        render(<CompareAccountsScreen />);

        expect(screen.queryByTestId('card-financial-ctrader-SVG')).not.toBeInTheDocument();
    });

    it('does not render Deriv X card when not available', () => {
        (useCFDCompareAccounts as jest.Mock).mockReturnValue({
            data: {
                ctraderAccount: mockCTraderAccount,
                dxtradeAccount: null,
                mt5Accounts: mockMT5Accounts,
            },
            hasCTraderAccountAvailable: true,
            hasDxtradeAccountAvailable: false,
        });

        render(<CompareAccountsScreen />);

        expect(screen.queryByTestId('card-financial-dxtrade-SVG')).not.toBeInTheDocument();
    });

    it('handles case when activeWallet is undefined', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: undefined,
        });

        render(<CompareAccountsScreen />);

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('carousel')).toBeInTheDocument();
    });
});
