import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useP2PNotificationCount from '../useP2PNotificationCount';

Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: jest.fn(() =>
            JSON.stringify({
                CR12345: { notifications: [{ is_seen: false }] },
                CR12346: { notifications: [{ is_seen: false }, { is_seen: false }, { is_seen: true }] },
            })
        ),
    },
});

describe('useP2PNotificationCount', () => {
    test('should return zero if there is no loginid', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useP2PNotificationCount(), { wrapper });

        expect(result.current).toBe(0);
    });

    test('should return the correct number of notifications for the current loginid', () => {
        const mock = mockStore({ client: { loginid: 'CR12345' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useP2PNotificationCount(), { wrapper });

        expect(result.current).toBe(1);
    });

    test('should ignore the seen notifications', () => {
        const mock = mockStore({ client: { loginid: 'CR12346' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useP2PNotificationCount(), { wrapper });

        expect(result.current).toBe(2);
    });

    test('should not update the correct number of notifications if the data in localStorage is undefined', () => {
        const mock = mockStore({ client: { loginid: 'CR12346' } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useP2PNotificationCount(), { wrapper });

        Object.defineProperty(window, 'localStorage', { value: { getItem: jest.fn(() => undefined) } });

        window.dispatchEvent(new Event('storage'));

        expect(result.current).toBe(2);
    });
});
