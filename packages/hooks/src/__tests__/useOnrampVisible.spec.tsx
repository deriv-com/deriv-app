import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useOnrampVisible from '../useOnrampVisible';

describe('useOnrampVisible', () => {
    test("should return false if client's currency is not crypto", () => {
        const mock = mockStore({
            client: {
                is_crypto: jest.fn(() => false),
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useOnrampVisible(), { wrapper });

        expect(result.current).toBe(false);
    });

    test("should return false if client's currency is crypto but client is virtual", () => {
        const mock = mockStore({
            client: {
                is_crypto: jest.fn(() => true),
                is_virtual: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useOnrampVisible(), { wrapper });

        expect(result.current).toBe(false);
    });

    test("should return true if client's currency is crypto and client is not virtual", () => {
        const mock = mockStore({
            client: {
                is_crypto: jest.fn(() => true),
                is_virtual: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useOnrampVisible(), { wrapper });

        expect(result.current).toBe(true);
    });
});
