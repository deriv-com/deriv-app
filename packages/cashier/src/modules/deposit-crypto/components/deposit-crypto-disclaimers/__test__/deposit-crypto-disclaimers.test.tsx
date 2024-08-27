import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import DepositCryptoDisclaimers from '../deposit-crypto-disclaimers';
import { APIProvider } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: {
            website_status: {
                currencies_config: {
                    BTC: { type: 'crypto', name: 'Bitcoin' },
                    ETH: { type: 'crypto', name: 'Ethereum' },
                    LTC: { type: 'crypto', name: 'Litecoin' },
                    USDC: { type: 'crypto', name: 'USDC' },
                    UST: { type: 'crypto', name: 'UST' },
                    eUSDT: { type: 'crypto', name: 'eUSDT' },
                },
            },
        },
    })),
}));

describe('DepositCryptoDisclaimers', () => {
    const createWrapper =
        (mock: ReturnType<typeof mockStore>) =>
        // eslint-disable-next-line react/display-name
        ({ children }: { children: JSX.Element }) =>
            (
                <StoreProvider store={mock}>
                    <APIProvider>{children}</APIProvider>
                </StoreProvider>
            );

    test('should show correct message for BTC', () => {
        const mock = mockStore({ client: { currency: 'BTC' } });

        render(<DepositCryptoDisclaimers />, { wrapper: createWrapper(mock) });

        expect(screen.getByText(/Bitcoin \(BTC\)/)).toBeInTheDocument();
    });

    test('should show correct message for ETH', () => {
        const mock = mockStore({ client: { currency: 'ETH' } });

        render(<DepositCryptoDisclaimers />, { wrapper: createWrapper(mock) });

        expect(screen.getByText(/Ethereum \(ETH\)/)).toBeInTheDocument();
    });

    test('should show correct message for LTC', () => {
        const mock = mockStore({ client: { currency: 'LTC' } });

        render(<DepositCryptoDisclaimers />, { wrapper: createWrapper(mock) });

        expect(screen.getByText(/Litecoin \(LTC\)/)).toBeInTheDocument();
    });

    test('should show correct message for USDC', () => {
        const mock = mockStore({ client: { currency: 'USDC' } });

        render(<DepositCryptoDisclaimers />, { wrapper: createWrapper(mock) });

        expect(screen.getByText(/Ethereum \(ERC20\)/)).toBeInTheDocument();
    });

    test('should show correct message for UST', () => {
        const mock = mockStore({ client: { currency: 'UST' } });

        render(<DepositCryptoDisclaimers />, { wrapper: createWrapper(mock) });

        expect(screen.getByText(/Omnicore/)).toBeInTheDocument();
    });

    test('should show correct message for eUSDT', () => {
        const mock = mockStore({ client: { currency: 'eUSDT' } });

        render(<DepositCryptoDisclaimers />, { wrapper: createWrapper(mock) });

        expect(screen.getByText(/Ethereum \(ERC20\)/)).toBeInTheDocument();
    });
});
