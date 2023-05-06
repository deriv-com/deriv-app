import React from 'react';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import CashierProviders from '../../../../../cashier-providers';
import DepositCryptoWalletAddress from '../deposit-crypto-wallet-address';

describe('DepositCryptoWalletAddress', () => {
    test('should show loading while fetching', () => {
        jest.mock('@deriv/hooks', () => ({
            ...jest.requireActual('@deriv/hooks'),
            useDepositCryptoAddress: () => ({
                data: undefined,
                isLoading: true,
                error: undefined,
                refetch: jest.fn(),
            }),
        }));
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<DepositCryptoWalletAddress />, { wrapper });

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });
});
