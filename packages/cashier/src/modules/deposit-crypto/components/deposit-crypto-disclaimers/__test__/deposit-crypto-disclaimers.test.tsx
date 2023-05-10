import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import DepositCryptoDisclaimers from '../deposit-crypto-disclaimers';

describe('DepositCryptoDisclaimers', () => {
    test('should show correct message for BTC', () => {
        const mock = mockStore({ client: { currency: 'BTC' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<DepositCryptoDisclaimers />, { wrapper });

        expect(screen.getByText(/Bitcoin \(BTC\)/)).toBeInTheDocument();
    });

    test('should show correct message for ETH', () => {
        const mock = mockStore({ client: { currency: 'ETH' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<DepositCryptoDisclaimers />, { wrapper });

        expect(screen.getByText(/Ethereum \(ETH\)/)).toBeInTheDocument();
    });

    test('should show correct message for LTC', () => {
        const mock = mockStore({ client: { currency: 'LTC' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<DepositCryptoDisclaimers />, { wrapper });

        expect(screen.getByText(/Litecoin \(LTC\)/)).toBeInTheDocument();
    });

    test('should show correct message for USDC', () => {
        const mock = mockStore({ client: { currency: 'USDC' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<DepositCryptoDisclaimers />, { wrapper });

        expect(screen.getByText(/Ethereum \(ERC20\)/)).toBeInTheDocument();
    });

    test('should show correct message for UST', () => {
        const mock = mockStore({ client: { currency: 'UST' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<DepositCryptoDisclaimers />, { wrapper });

        expect(screen.getByText(/Omnicore/)).toBeInTheDocument();
    });

    test('should show correct message for eUSDT', () => {
        const mock = mockStore({ client: { currency: 'eUSDT' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<DepositCryptoDisclaimers />, { wrapper });

        expect(screen.getByText(/Ethereum \(ERC20\)/)).toBeInTheDocument();
    });
});
