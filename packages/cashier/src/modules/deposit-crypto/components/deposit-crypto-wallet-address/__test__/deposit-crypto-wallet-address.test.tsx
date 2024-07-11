import React from 'react';
import { mockStore } from '@deriv-lib/stores';
import { render, screen } from '@testing-library/react';
import CashierProviders from '../../../../../cashier-providers';
import DepositCryptoWalletAddress from '../deposit-crypto-wallet-address';

jest.mock('@deriv-lib/api', () => ({
    ...jest.requireActual('@deriv-lib/api'),
    useRequest: jest.fn(() => ({
        data: { cashier: { deposit: { address: '0xB921C874e2Da6Bf00616C68F8746b48125A547C0' } } },
        mutate: jest.fn(),
        isLoading: true,
    })),
}));

describe('DepositCryptoWalletAddress', () => {
    test('should show loading while fetching', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<DepositCryptoWalletAddress />, { wrapper });

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });
});
