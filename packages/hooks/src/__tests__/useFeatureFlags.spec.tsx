import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useFeatureFlags from '../useFeatureFlags';

describe('useFeatureFlags', () => {
    test('should return false for the test flag', async () => {
        // @ts-expect-error Using a test flag key for testing purposes.
        const mock = mockStore({ feature_flags: { data: { test_flag: false } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useFeatureFlags(), { wrapper });

        // @ts-expect-error Using a test flag key for testing purposes.
        expect(result.current.is_test_flag_enabled).toBe(false);
    });

    test('should return true for the test flag', async () => {
        // @ts-expect-error Using a test flag key for testing purposes.
        const mock = mockStore({ feature_flags: { data: { test_flag: true } } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useFeatureFlags(), { wrapper });

        // @ts-expect-error Using a test flag key for testing purposes.
        expect(result.current.is_test_flag_enabled).toBe(true);
    });
});
