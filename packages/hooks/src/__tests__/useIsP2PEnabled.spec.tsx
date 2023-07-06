import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useIsP2PEnabled from '../useIsP2PEnabled';

describe('useIsP2PEnabled', () => {
    test('should return false if users currency is not supported in p2p', () => {
        const mock = mockStore({
            client: { currency: 'AUD' },
            website_status: { data: { p2p_config: { supported_currencies: ['usd'] } } },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if users currency is supported in p2p but is virtual', () => {
        const mock = mockStore({
            client: { currency: 'USD', is_virtual: true },
            website_status: { data: { p2p_config: { supported_currencies: ['usd'] } } },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return true if users currency is supported in p2p and is_low_risk_cr_eu_real is false', () => {
        const mock = mockStore({
            client: { currency: 'USD' },
            website_status: { data: { p2p_config: { supported_currencies: ['usd'] } } },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should return false if users currency is supported in p2p but is_low_risk_cr_eu_real is true', () => {
        const mock = mockStore({
            client: { currency: 'USD' },
            traders_hub: { is_low_risk_cr_eu_real: true },
            website_status: { data: { p2p_config: { supported_currencies: ['usd'] } } },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current).toBe(false);
    });
});
