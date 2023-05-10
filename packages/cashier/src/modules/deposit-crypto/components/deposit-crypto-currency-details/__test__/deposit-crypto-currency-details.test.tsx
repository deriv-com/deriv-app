import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import DepositCryptoCurrencyDetails from '../deposit-crypto-currency-details';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getCurrencyName: (currency: string) => (currency === 'BTC' ? 'Bitcoin' : 'Ethereum'),
    CryptoConfig: {
        get: () => ({
            BTC: {
                display_code: 'BTC',
            },
            ETH: {
                display_code: 'ETH',
            },
        }),
    },
}));

describe('DepositCryptoCurrencyDetails', () => {
    test('should show correct message for BTC', async () => {
        const mock = mockStore({ client: { currency: 'BTC' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<DepositCryptoCurrencyDetails />, { wrapper });

        expect(screen.getByText('Send only Bitcoin (BTC) to this address.')).toBeInTheDocument();
    });

    test('should show correct message for ETH', async () => {
        const mock = mockStore({ client: { currency: 'ETH' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<DepositCryptoCurrencyDetails />, { wrapper });

        expect(screen.getByText('Send only Ethereum (ETH) to this address.')).toBeInTheDocument();
    });
});
