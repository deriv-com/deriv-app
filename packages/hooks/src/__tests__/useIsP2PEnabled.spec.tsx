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

const mock_usefetch_return_value = {
    data: {
        website_status: {
            p2p_config: {
                disabled: 0,
                supported_currencies: ['usd'],
            },
        },
    },
};

describe('useIsP2PEnabled', () => {
    test('should return false if p2p is disabled', () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ currency: 'USD', is_virtual: 0 }],
            },
        });

        mock_usefetch_return_value.data.website_status.p2p_config.disabled = 1;
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue(mock_usefetch_return_value);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.data).toBe(false);
    });

    test('should return false if p2p is not disabled but is virtual', () => {
        const mock = mockStore({
            client: {
                is_virtual: true,
                active_accounts: [{ currency: 'USD', is_virtual: 0 }],
            },
        });
        mock_usefetch_return_value.data.website_status.p2p_config.disabled = 0;
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue(mock_usefetch_return_value);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.data).toBe(false);
    });

    test('should return true if p2p is not disabled and is_low_risk_cr_eu_real is false', () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ currency: 'USD', is_virtual: 0 }],
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue(mock_usefetch_return_value);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.data).toBe(true);
    });

    test('should return false if p2p is not disabled but is_low_risk_cr_eu_real is true', () => {
        const mock = mockStore({
            traders_hub: {
                is_low_risk_cr_eu_real: true,
            },
            client: {
                active_accounts: [{ currency: 'USD', is_virtual: 0 }],
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue(mock_usefetch_return_value);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.data).toBe(false);
    });

    test('should return false if p2p is not disabled but client has no supported currencies', () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ currency: 'EUR', is_virtual: 0 }],
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue(mock_usefetch_return_value);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.data).toBe(false);
    });
});
