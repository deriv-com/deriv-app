import React from 'react';
import { APIProvider, AuthProvider, useBalance } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletListCardBalance from '../WalletListCardBalance';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useBalance: jest.fn(() => ({
        ...jest.requireActual('@deriv/api-v2').useBalance(),
        isLoading: false,
    })),
}));

describe('WalletListCardBalance', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <APIProvider>
            <AuthProvider>{children}</AuthProvider>
        </APIProvider>
    );

    it('should show account balance', () => {
        render(<WalletListCardBalance balance={'100 USD'} />, { wrapper });
        expect(screen.getByText('100 USD')).toBeInTheDocument();
    });

    it('should show loader when balance has not been loaded', () => {
        (useBalance as jest.Mock).mockImplementationOnce(() => ({
            ...jest.requireActual('@deriv/api-v2').useBalance(),
            isLoading: true,
        }));
        render(<WalletListCardBalance balance={'100 USD'} />, { wrapper });
        expect(screen.queryByText('100 USD')).not.toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_list_card_balance_loader')).toBeInTheDocument();
    });
});
