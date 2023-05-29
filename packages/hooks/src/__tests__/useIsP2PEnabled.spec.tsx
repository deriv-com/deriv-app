import * as React from 'react';
import { APIProvider, useFetch } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useIsP2PEnabled from '../useIsP2PEnabled';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'website_status'>>;

describe('useIsP2PEnabled', () => {
    test('should return false if users currency is not supported in p2p', () => {
        const mock = mockStore({ client: { currency: 'AUD' } });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { p2p_config: { supported_currencies: ['usd'] } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.data).toBe(false);
    });

    test('should return false if users currency is supported in p2p but is virtual', () => {
        const mock = mockStore({
            client: {
                currency: 'USD',
                is_virtual: true,
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { p2p_config: { supported_currencies: ['usd'] } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.data).toBe(false);
    });

    test('should return true if users currency is supported in p2p and is_low_risk_cr_eu_real is false', () => {
        const mock = mockStore({
            client: {
                currency: 'USD',
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { p2p_config: { supported_currencies: ['usd'] } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.data).toBe(true);
    });

    test('should return false if users currency is supported in p2p but is_low_risk_cr_eu_real is true', () => {
        const mock = mockStore({
            client: {
                currency: 'USD',
            },
            traders_hub: {
                is_low_risk_cr_eu_real: true,
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { p2p_config: { supported_currencies: ['usd'] } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.data).toBe(false);
    });
});
