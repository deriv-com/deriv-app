import React from 'react';
import { APIProvider, useActiveWalletAccount, useBalanceSubscription } from '@deriv-app/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import WalletsAuthProvider from '../../../../../AuthProvider';
import WalletCashierHeader from '../WalletCashierHeader';

jest.mock('@deriv-app/api-v2', () => ({
    ...jest.requireActual('@deriv-app/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useBalanceSubscription: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({ history: {} }),
    useLocation: () => ({ pathname: '/' }),
}));

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <APIProvider>
        <WalletsAuthProvider>{children}</WalletsAuthProvider>
    </APIProvider>
);

describe('<WalletCashierHeader/>', () => {
    beforeEach(() => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                loginid: 'CR1',
            },
        });
        (useBalanceSubscription as jest.Mock).mockReturnValue({
            data: {
                balance: 10,
            },
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        });
    });

    it('should render header', () => {
        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        const divElement = screen.getByTestId('dt_wallet_gradient_background');
        expect(divElement).toBeInTheDocument();
    });

    it('should display correct balance', () => {
        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        const balanceElement = screen.getByText('10.00 USD');
        expect(balanceElement).toBeInTheDocument();
    });

    it('should display default content with badge for demo', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                is_virtual: true,
                loginid: 'CR1',
            },
        });

        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('10.00 USD')).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
    });

    it('should subscribe to the balance call when the header mounts', () => {
        const mockSubscribe = jest.fn();

        (useBalanceSubscription as jest.Mock).mockReturnValue({
            data: {
                balance: 10,
            },
            subscribe: mockSubscribe,
            unsubscribe: jest.fn(),
        });

        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        expect(mockSubscribe).toBeCalledWith({ loginid: 'CR1' });
    });

    it('should unsubscribe from the balance call when the header unmounts', async () => {
        const mockUnsubscribe = jest.fn();

        (useBalanceSubscription as jest.Mock).mockReturnValue({
            data: {
                balance: 10,
            },
            subscribe: jest.fn(),
            unsubscribe: mockUnsubscribe,
        });

        const { unmount } = render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        unmount();
        await waitFor(() => {
            expect(mockUnsubscribe).toBeCalled();
        });
    });

    it('should display real transfer tabs - Deposit, Withdraw, Transfer, Transaction', () => {
        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        expect(screen.getByText('Deposit')).toBeInTheDocument();
        expect(screen.getByText('Withdraw')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
    });

    it('should display demo transfer tabs - Reset Balance, Transfer, Transaction', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                is_virtual: true,
                loginid: 'CR1',
            },
        });

        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        expect(screen.getByText('Reset Balance')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
    });
});
