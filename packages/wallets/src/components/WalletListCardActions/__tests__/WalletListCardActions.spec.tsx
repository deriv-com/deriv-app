import React, { PropsWithChildren } from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import useDevice from '../../../hooks/useDevice';
import WalletListCardActions from '../WalletListCardActions';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(() => ({
        data: {
            currency: 'USD',
            display_login: 'CRW123456',
            email: '',
            is_active: true,
            is_virtual: false,
            loginid: 'CRW123456',
        },
    })),
}));

jest.mock('.../../../hooks/useDevice');
const mockedUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;

const history = createMemoryHistory();
const wrapper = ({ children }: PropsWithChildren) => <Router history={history}>{children}</Router>;

describe('WalletListCardActions', () => {
    beforeEach(() => {
        mockedUseDevice.mockReturnValue({ isDesktop: true, isMobile: false, isTablet: false });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should show the actions texts if the real wallet is active', () => {
        render(<WalletListCardActions />, { wrapper });
        expect(screen.getByText('Deposit')).toBeInTheDocument();
        expect(screen.getByText('Withdraw')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
    });

    it('should show the actions texts if the demo wallet is active', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                display_login: 'VRW123456',
                email: '',
                is_active: true,
                is_virtual: true,
                loginid: 'VRW123456',
            },
        });

        render(<WalletListCardActions />, { wrapper });
        expect(screen.getByText('Reset balance')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
    });

    it("shouldn't show the actions texts if the real wallet is inactive", () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                display_login: 'CRW123456',
                email: '',
                is_active: false,
                is_virtual: false,
                loginid: 'CRW123456',
            },
        });

        render(<WalletListCardActions />, { wrapper });
        expect(screen.queryByText('Deposit')).not.toBeInTheDocument();
        expect(screen.queryByText('Withdraw')).not.toBeInTheDocument();
        expect(screen.queryByText('Transfer')).not.toBeInTheDocument();
        expect(screen.queryByText('Transactions')).not.toBeInTheDocument();
    });

    it('should switch account and redirect to the correct page when clicking on one of the actions and wallet is inactive', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                display_login: 'CRW123456',
                email: '',
                is_active: false,
                is_virtual: false,
                loginid: 'CRW123456',
            },
        });

        render(<WalletListCardActions />, { wrapper });
        screen.getByRole('button', { name: 'deposit' }).click();
        expect(history.location.pathname).toBe('/wallets/cashier/deposit');
    });

    it('should render the actions for mobile', () => {
        mockedUseDevice.mockReturnValue({ isDesktop: false, isMobile: true, isTablet: false });
        const { container } = render(<WalletListCardActions />, {
            wrapper,
        });
        // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
        const mobileActions = container.querySelector('.wallets-mobile-actions');
        expect(mobileActions).toBeInTheDocument();
    });

    it('should switch account and redirect to the correct page when clicking on one of the actions and wallet is inactive for mobile', () => {
        mockedUseDevice.mockReturnValue({ isDesktop: false, isMobile: true, isTablet: false });
        render(<WalletListCardActions />, {
            wrapper,
        });
        screen.getByRole('button', { name: 'deposit' }).click();
        expect(history.location.pathname).toBe('/wallets/cashier/deposit');
    });

    it('should redirect to cashier page when clicking on deposit', () => {
        render(<WalletListCardActions />, { wrapper });
        screen.getByRole('button', { name: 'deposit' }).click();
        expect(history.location.pathname).toBe('/wallets/cashier/deposit');
    });

    it('should redirect to cashier page when clicking on withdraw', () => {
        render(<WalletListCardActions />, { wrapper });
        screen.getByRole('button', { name: 'withdraw' }).click();
        expect(history.location.pathname).toBe('/wallets/cashier/withdraw');
    });

    it('should redirect to cashier page when clicking on transfer', () => {
        render(<WalletListCardActions />, { wrapper });
        screen.getByRole('button', { name: 'transfer' }).click();
        expect(history.location.pathname).toBe('/wallets/cashier/transfer');
    });

    it('should redirect to cashier page when clicking on transactions', () => {
        render(<WalletListCardActions />, { wrapper });
        screen.getByRole('button', { name: 'transactions' }).click();
        expect(history.location.pathname).toBe('/wallets/cashier/transactions');
    });

    it('should redirect to cashier page when clicking on reset balance', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                display_login: 'VRW123456',
                email: '',
                is_active: true,
                is_virtual: true,
                loginid: 'VRW123456',
            },
        });

        render(<WalletListCardActions />, { wrapper });
        screen.getByRole('button', { name: 'reset-balance' }).click();
        expect(history.location.pathname).toBe('/wallets/cashier/reset-balance');
    });
});
