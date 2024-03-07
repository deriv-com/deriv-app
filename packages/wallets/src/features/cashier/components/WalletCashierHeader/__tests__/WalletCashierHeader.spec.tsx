import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletCashierHeader from '../WalletCashierHeader';

const DISPLAY_BALANCE = 'RM42';
jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletBalance: jest.fn().mockReturnValue({
        displayBalance: DISPLAY_BALANCE,
    }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({ history: {} }),
    useLocation: () => ({ pathname: '/wallets' }),
}));

describe('<WalletCashierHeader/>', () => {
    it('renders', () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <WalletCashierHeader hideWalletDetails={false} />
                </AuthProvider>
            </APIProvider>
        );

        const divElement = screen.getByTestId('dt_wallet_gradient_background');
        expect(divElement).toBeInTheDocument();
    });

    it('displays balance', () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <WalletCashierHeader hideWalletDetails={false} />
                </AuthProvider>
            </APIProvider>
        );

        const balanceElement = screen.getByText(DISPLAY_BALANCE);
        expect(balanceElement).toBeInTheDocument();
    });
});
