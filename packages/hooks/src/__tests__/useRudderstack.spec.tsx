import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { act, renderHook } from '@testing-library/react-hooks';
import useRudderstack from '../useRudderstack';

describe('useRudderstack', () => {
    test('should return false if user has not been logged in', async () => {
        const mock = mockStore({
            rudderstack: {
                is_applicable: false,
                has_identified: false,
                current_page: '',
            },
            client: {
                user_id: '',
                is_logged_in: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useRudderstack(), { wrapper });

        act(() => {
            result.current.identifyEvent();
        });

        expect(mock.rudderstack.has_identified).toBe(false);
    });

    test('should return true if user has logged in and indentified', async () => {
        const mock = mockStore({
            rudderstack: {
                is_applicable: false,
                has_identified: false,
                current_page: '',
            },
            client: {
                user_id: 'C1234567',
                is_logged_in: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useRudderstack(), { wrapper });

        act(() => {
            result.current.identifyEvent();
        });

        expect(mock.rudderstack.has_identified).toBe(true);
    });

    test('should return current page if pageView is called', async () => {
        const mock = mockStore({
            rudderstack: {
                is_applicable: true,
                has_identified: true,
                current_page: '',
            },
            client: {
                user_id: 'C1234567',
                is_logged_in: true,
            },
        });

        window.location.href = 'https://app.deriv.com';

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(useRudderstack, { wrapper });

        act(() => {
            result.current.pageView();
        });

        expect(mock.rudderstack.current_page).toBe('app.deriv.com');
    });

    test('should not be identified when reset is called', async () => {
        const mock = mockStore({
            rudderstack: {
                is_applicable: true,
                has_identified: true,
                current_page: '',
            },
            client: {
                user_id: 'C1234567',
                is_logged_in: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(useRudderstack, { wrapper });

        act(() => {
            result.current.reset();
        });

        expect(mock.rudderstack.has_identified).toBe(false);
    });
});
