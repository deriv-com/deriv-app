import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import DepositCryptoCurrencyDetails from '../deposit-crypto-currency-details';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: {
            website_status: {
                currencies_config: {
                    ETH: { type: 'crypto', name: 'Ethereum' },
                    BTC: { type: 'crypto', name: 'Bitcoin' },
                },
            },
        },
    })),
}));

describe('DepositCryptoCurrencyDetails', () => {
    test('should show correct message for BTC', () => {
        const mock = mockStore({ client: { currency: 'BTC' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<DepositCryptoCurrencyDetails />, { wrapper });

        expect(screen.getByText('Send only Bitcoin (BTC) to this address.')).toBeInTheDocument();
    });

    test('should show correct message for ETH', () => {
        const mock = mockStore({ client: { currency: 'ETH' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<DepositCryptoCurrencyDetails />, { wrapper });

        expect(screen.getByText('Send only Ethereum (ETH) to this address.')).toBeInTheDocument();
    });
});
