import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useNeedAuthentication from '../useNeedAuthentication';

describe('useNeedAuthentication', () => {
    test('should be false if is_authentication_needed and is_low_risk_cr_eu_real both are false', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedAuthentication(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be false if is_authentication_needed is false and is_low_risk_cr_eu_real is true', async () => {
        const mock = mockStore({
            traders_hub: {
                is_low_risk_cr_eu_real: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedAuthentication(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be false if is_authentication_needed is true and is_low_risk_cr_eu_real is false', async () => {
        const mock = mockStore({
            client: {
                is_authentication_needed: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedAuthentication(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if is_authentication_needed and is_low_risk_cr_eu_real both are true', async () => {
        const mock = mockStore({
            client: {
                is_authentication_needed: true,
            },
            traders_hub: {
                is_low_risk_cr_eu_real: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedAuthentication(), { wrapper });

        expect(result.current).toBe(true);
    });
});
