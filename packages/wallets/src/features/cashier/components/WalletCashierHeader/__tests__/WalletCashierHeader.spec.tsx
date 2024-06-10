import React from 'react';
import { APIProvider, useActiveWalletAccount, useBalanceSubscription } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import WalletsAuthProvider from '../../../../../AuthProvider';
import WalletCashierHeader from '../WalletCashierHeader';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
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

    it('should test if header renders', () => {
        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        const divElement = screen.getByTestId('dt_wallet_gradient_background');
        expect(divElement).toBeInTheDocument();
    });

    it('should test if correct balance displays', () => {
        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        const balanceElement = screen.getByText('10.00 USD');
        expect(balanceElement).toBeInTheDocument();
    });

    it('should test if the balance call is subscribed with the correct account when the header mounts', () => {
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

    it('should test if the balance call is unsubscribed when the header mounts', async () => {
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

    it('should test if the correct tabs are displayed for real wallets', () => {
        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        expect(screen.getByText('Deposit')).toBeInTheDocument();
        expect(screen.getByText('Withdraw')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
    });

    it('should test if the correct tabs are displayed for demo wallets', () => {
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
