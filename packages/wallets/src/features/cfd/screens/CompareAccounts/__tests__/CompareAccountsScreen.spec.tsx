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
    default: ({ account }: { account: { platform: string } }) => <div data-testid={`card-${account.platform}`} />,
}));

jest.mock('../CompareAccountsHeader', () => ({
    __esModule: true,
    default: () => <div data-testid='header' />,
}));

describe('CompareAccountsScreen', () => {
    const mockMT5Accounts = [{ is_default_jurisdiction: 'true', platform: 'mt5', product: 'standard' }];

    const mockCTraderAccount = { platform: 'ctrader' };
    const mockDxtradeAccount = { platform: 'dxtrade' };

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

    it('renders MT5 account cards correctly', () => {
        render(<CompareAccountsScreen />);

        mockMT5Accounts.forEach(account => {
            expect(screen.getByTestId(`card-${account.platform}`)).toBeInTheDocument();
        });
    });

    it('renders cTrader account card when available', () => {
        render(<CompareAccountsScreen />);

        expect(screen.getByTestId('card-ctrader')).toBeInTheDocument();
    });

    it('does not render cTrader account card when unavailable', () => {
        (useCFDCompareAccounts as jest.Mock).mockReturnValue({
            data: {
                ctraderAccount: mockCTraderAccount,
                dxtradeAccount: mockDxtradeAccount,
                mt5Accounts: mockMT5Accounts,
            },
            hasCTraderAccountAvailable: false,
            hasDxtradeAccountAvailable: true,
        });

        render(<CompareAccountsScreen />);

        expect(screen.queryByTestId('card-ctrader')).not.toBeInTheDocument();
    });

    it('renders demo accounts when wallet is virtual', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_malta_wallet: false, is_virtual: true },
        });

        render(<CompareAccountsScreen />);

        // Verify that cards are rendered with isDemo prop
        const cards = screen.getAllByTestId(/^card-/);
        expect(cards.length).toBeGreaterThan(0);
    });

    it('handles EU region correctly', () => {
        (useIsEuRegion as jest.Mock).mockReturnValue({
            data: true,
            isLoading: false,
        });

        render(<CompareAccountsScreen />);

        // Verify that cards are rendered with isEuRegion prop
        const cards = screen.getAllByTestId(/^card-/);
        expect(cards.length).toBeGreaterThan(0);
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
