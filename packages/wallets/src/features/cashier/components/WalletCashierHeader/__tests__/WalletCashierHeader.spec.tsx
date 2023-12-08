import React from 'react';
import { APIProvider } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import WalletCashierHeader from '../WalletCashierHeader';

const DISPLAY_BALANCE = 'RM42';
jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
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
                <WalletCashierHeader hideWalletDetails={false} />
            </APIProvider>
        );

        const divElement = screen.getByTestId('dt_wallet-gradient-background');
        expect(divElement).toBeInTheDocument();
    });

    it('displays balance', () => {
        render(
            <APIProvider>
                <WalletCashierHeader hideWalletDetails={false} />
            </APIProvider>
        );

        const balanceElement = screen.getByText(DISPLAY_BALANCE);
        expect(balanceElement).toBeInTheDocument();
    });
});
