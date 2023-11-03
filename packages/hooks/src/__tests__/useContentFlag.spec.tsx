import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useContentFlag from '../useContentFlag';

describe('useContentFlag', () => {
    test('should return true for cr_demo when content flag is cr_demo', async () => {
        const mock = mockStore({ traders_hub: { content_flag: 'cr_demo' } });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useContentFlag(), { wrapper });
        expect(result.current.is_cr_demo).toBe(true);
        expect(result.current.is_eu_demo).toBe(false);
        expect(result.current.is_eu_real).toBe(false);
        expect(result.current.is_high_risk_cr).toBe(false);
        expect(result.current.is_low_risk_cr_eu).toBe(false);
        expect(result.current.is_low_risk_cr_non_eu).toBe(false);
    });

    test('should return true for eu_demo when content flag is eu_demo', async () => {
        const mock = mockStore({ traders_hub: { content_flag: 'eu_demo' } });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useContentFlag(), { wrapper });
        expect(result.current.is_cr_demo).toBe(false);
        expect(result.current.is_eu_demo).toBe(true);
        expect(result.current.is_eu_real).toBe(false);
        expect(result.current.is_high_risk_cr).toBe(false);
        expect(result.current.is_low_risk_cr_eu).toBe(false);
        expect(result.current.is_low_risk_cr_non_eu).toBe(false);
    });

    test('should return true for eu_real when content flag is eu_real', async () => {
        const mock = mockStore({ traders_hub: { content_flag: 'eu_real' } });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useContentFlag(), { wrapper });
        expect(result.current.is_cr_demo).toBe(false);
        expect(result.current.is_eu_demo).toBe(false);
        expect(result.current.is_eu_real).toBe(true);
        expect(result.current.is_high_risk_cr).toBe(false);
        expect(result.current.is_low_risk_cr_eu).toBe(false);
        expect(result.current.is_low_risk_cr_non_eu).toBe(false);
    });

    test('should return true for high_risk_cr when content flag is high_risk_cr', async () => {
        const mock = mockStore({ traders_hub: { content_flag: 'high_risk_cr' } });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useContentFlag(), { wrapper });
        expect(result.current.is_cr_demo).toBe(false);
        expect(result.current.is_eu_demo).toBe(false);
        expect(result.current.is_eu_real).toBe(false);
        expect(result.current.is_high_risk_cr).toBe(true);
        expect(result.current.is_low_risk_cr_eu).toBe(false);
        expect(result.current.is_low_risk_cr_non_eu).toBe(false);
    });

    test('should return true for low_risk_cr_eu when content flag is low_risk_cr_eu', async () => {
        const mock = mockStore({ traders_hub: { content_flag: 'low_risk_cr_eu' } });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useContentFlag(), { wrapper });
        expect(result.current.is_cr_demo).toBe(false);
        expect(result.current.is_eu_demo).toBe(false);
        expect(result.current.is_eu_real).toBe(false);
        expect(result.current.is_high_risk_cr).toBe(false);
        expect(result.current.is_low_risk_cr_eu).toBe(true);
        expect(result.current.is_low_risk_cr_non_eu).toBe(false);
    });

    test('should return true for low_risk_cr_non_eu when content flag is low_risk_cr_non_eu', async () => {
        const mock = mockStore({ traders_hub: { content_flag: 'low_risk_cr_non_eu' } });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useContentFlag(), { wrapper });
        expect(result.current.is_cr_demo).toBe(false);
        expect(result.current.is_eu_demo).toBe(false);
        expect(result.current.is_eu_real).toBe(false);
        expect(result.current.is_high_risk_cr).toBe(false);
        expect(result.current.is_low_risk_cr_eu).toBe(false);
        expect(result.current.is_low_risk_cr_non_eu).toBe(true);
    });
});
