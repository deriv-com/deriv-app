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
                    BTC: { display_code: 'BTC', type: 'crypto', name: 'Bitcoin' },
                    ETH: { display_code: 'ETH', type: 'crypto', name: 'Ethereum' },
                    LTC: { display_code: 'LTC', type: 'crypto', name: 'Litecoin' },
                    USDC: { display_code: 'USDC', type: 'crypto', name: 'USD Coin' },
                    UST: { display_code: 'USDT', type: 'crypto', name: 'TerraUSD' },
                    eUSDT: { display_code: 'eUSDT', type: 'crypto', name: 'ERC20' },
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

        expect(screen.getByText('Only send Bitcoin (BTC) to this address.')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Make sure to copy the Deriv BTC account address above and paste it into your crypto wallet.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/Bitcoin \(BTC\) network/)).toBeInTheDocument();
    });

    test('should show correct message for ETH', () => {
        const mock = mockStore({ client: { currency: 'ETH' } });

        render(<DepositCryptoDisclaimers />, { wrapper: createWrapper(mock) });

        expect(screen.getByText('Only send Ethereum (ETH) to this address.')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Make sure to copy the Deriv ETH account address above and paste it into your crypto wallet.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/Ethereum \(ETH\) network/)).toBeInTheDocument();
    });

    test('should show correct message for LTC', () => {
        const mock = mockStore({ client: { currency: 'LTC' } });

        render(<DepositCryptoDisclaimers />, { wrapper: createWrapper(mock) });

        expect(screen.getByText('Only send Litecoin (LTC) to this address.')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Make sure to copy the Deriv LTC account address above and paste it into your crypto wallet.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/Litecoin \(LTC\) network/)).toBeInTheDocument();
    });

    test('should show correct message for USDC', () => {
        const mock = mockStore({ client: { currency: 'USDC' } });

        render(<DepositCryptoDisclaimers />, { wrapper: createWrapper(mock) });

        expect(screen.getByText('Only send USD Coin (USDC) to this address.')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Make sure to copy the Deriv USDC account address above and paste it into your crypto wallet.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/Ethereum \(ERC20\) network/)).toBeInTheDocument();
    });

    test('should show correct message for UST', () => {
        const mock = mockStore({ client: { currency: 'UST' } });

        render(<DepositCryptoDisclaimers />, { wrapper: createWrapper(mock) });

        expect(screen.getByText('Only send TerraUSD (USDT) to this address.')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Make sure to copy the Deriv UST account address above and paste it into your crypto wallet.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/Omnicore network/)).toBeInTheDocument();
    });

    test('should show correct message for eUSDT', () => {
        const mock = mockStore({ client: { currency: 'eUSDT' } });

        render(<DepositCryptoDisclaimers />, { wrapper: createWrapper(mock) });

        expect(screen.getByText('Only send ERC20 (eUSDT) to this address.')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Make sure to copy the Deriv eUSDT account address above and paste it into your crypto wallet.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/\(ERC20\) network/)).toBeInTheDocument();
    });
});
