import React, { PropsWithChildren } from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import useDevice from '../../../hooks/useDevice';
import WalletListCardActions from '../WalletListCardActions';

const mockSwitchAccount = jest.fn();
jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: () => ({
        data: {
            currency: 'USD',
            display_login: 'VRW123456',
            email: '',
        },
    }),
    useAuthorize: () => ({
        switchAccount: mockSwitchAccount,
    }),
}));

jest.mock('.../../../hooks/useDevice');
const mockedUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;

const history = createMemoryHistory();
const wrapper = ({ children }: PropsWithChildren) => (
    <Router history={history}>
        <APIProvider>
            <AuthProvider>{children}</AuthProvider>
        </APIProvider>
    </Router>
);
describe('WalletListCardActions', () => {
    beforeEach(() => {
        mockedUseDevice.mockReturnValue({ isDesktop: true, isMobile: false, isTablet: false });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should show the actions texts if the real wallet is active', () => {
        render(<WalletListCardActions isActive isDemo={false} loginid='CRW123456' />, { wrapper });
        expect(screen.getByText('Deposit')).toBeInTheDocument();
        expect(screen.getByText('Withdraw')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
    });

    it('should show the actions texts if the demo wallet is active', () => {
        render(<WalletListCardActions isActive isDemo loginid='VRW123456' />, { wrapper });
        expect(screen.getByText('Reset balance')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
    });

    it("shouldn't show the actions texts if the real wallet is inactive", () => {
        render(<WalletListCardActions isActive={false} isDemo={false} loginid='CRW123456' />, { wrapper });
        expect(screen.queryByText('Deposit')).not.toBeInTheDocument();
        expect(screen.queryByText('Withdraw')).not.toBeInTheDocument();
        expect(screen.queryByText('Transfer')).not.toBeInTheDocument();
        expect(screen.queryByText('Transactions')).not.toBeInTheDocument();
    });

    it('should switch account and redirect to the correct page when clicking on one of the actions and wallet is inactive', () => {
        render(<WalletListCardActions isActive={false} isDemo={false} loginid='CRW123456' />, { wrapper });
        screen.getByRole('button', { name: 'deposit' }).click();
        expect(mockSwitchAccount).toHaveBeenCalledWith('CRW123456');
        expect(history.location.pathname).toBe('/wallets/cashier/deposit');
    });

    it('should render the actions for mobile', () => {
        mockedUseDevice.mockReturnValue({ isDesktop: false, isMobile: true, isTablet: false });
        const { container } = render(<WalletListCardActions isActive isDemo={false} loginid='CRW123456' />, {
            wrapper,
        });
        // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
        const mobileActions = container.querySelector('.wallets-mobile-actions');
        expect(mobileActions).toBeInTheDocument();
    });

    it('should switch account and redirect to the correct page when clicking on one of the actions and wallet is inactive for mobile', () => {
        mockedUseDevice.mockReturnValue({ isDesktop: false, isMobile: true, isTablet: false });
        render(<WalletListCardActions isActive isDemo={false} loginid='CRW123456' />, {
            wrapper,
        });
        screen.getByRole('button', { name: 'deposit' }).click();
        expect(mockSwitchAccount).toHaveBeenCalledWith('CRW123456');
        expect(history.location.pathname).toBe('/wallets/cashier/deposit');
    });

    it('should redirect to cashier page when clicking on deposit', () => {
        render(<WalletListCardActions isActive isDemo={false} loginid='CRW123456' />, { wrapper });
        screen.getByRole('button', { name: 'deposit' }).click();
        expect(history.location.pathname).toBe('/wallets/cashier/deposit');
    });

    it('should redirect to cashier page when clicking on withdraw', () => {
        render(<WalletListCardActions isActive isDemo={false} loginid='CRW123456' />, { wrapper });
        screen.getByRole('button', { name: 'withdraw' }).click();
        expect(history.location.pathname).toBe('/wallets/cashier/withdraw');
    });

    it('should redirect to cashier page when clicking on transfer', () => {
        render(<WalletListCardActions isActive isDemo={false} loginid='CRW123456' />, { wrapper });
        screen.getByRole('button', { name: 'transfer' }).click();
        expect(history.location.pathname).toBe('/wallets/cashier/transfer');
    });

    it('should redirect to cashier page when clicking on transactions', () => {
        render(<WalletListCardActions isActive isDemo={false} loginid='CRW123456' />, { wrapper });
        screen.getByRole('button', { name: 'transactions' }).click();
        expect(history.location.pathname).toBe('/wallets/cashier/transactions');
    });

    it('should redirect to cashier page when clicking on reset balance', () => {
        render(<WalletListCardActions isActive isDemo loginid='VRW123456' />, { wrapper });
        screen.getByRole('button', { name: 'reset-balance' }).click();
        expect(history.location.pathname).toBe('/wallets/cashier/reset-balance');
    });
});
