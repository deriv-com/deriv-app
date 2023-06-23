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
    test('should return false if p2p is disabled', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { website_status: { p2p_config: { disabled: 1 } } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mockStore({})}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.data).toBe(false);
    });

    test('should return false if p2p is not disabled but is virtual', () => {
        const mock = mockStore({
            client: {
                is_virtual: true,
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { website_status: { p2p_config: { disabled: 1 } } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.data).toBe(false);
    });

    test('should return true if p2p is not disabled and is_low_risk_cr_eu_real is false', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { website_status: { p2p_config: { disabled: 0 } } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mockStore({})}>{children}</StoreProvider>
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
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { website_status: { p2p_config: { disabled: 0 } } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useIsP2PEnabled(), { wrapper });

        expect(result.current.data).toBe(false);
    });
});
