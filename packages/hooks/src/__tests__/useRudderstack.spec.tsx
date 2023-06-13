import * as React from 'react';
import { mockStore, StoreProvider, useStore } from '@deriv/stores';
import { act, renderHook } from '@testing-library/react-hooks';
import useRudderstack from '../useRudderstack';

describe('useRudderstack', () => {
    test('should return true if user has logged in and indentified', async () => {
        const mock = mockStore({
            rudderstack: {
                is_applicable: true,
                has_identified: false,
                current_page: '',
            },
            client: {
                user_id: 'C1234567',
                is_logged_in: true,
            },
        });

        mock.rudderstack.identifyEvent = () => {
            return new Promise(resolve => {
                if (mock.rudderstack.is_applicable && !mock.rudderstack.has_identified) {
                    if (mock.client.user_id) {
                        mock.rudderstack.has_identified = true;
                        resolve();
                    }
                }
                resolve();
            });
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(useRudderstack, { wrapper });

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

        mock.rudderstack.pageView = () => {
            const current_page = 'app.deriv.com';
            if (
                mock.rudderstack.is_applicable &&
                mock.client.is_logged_in &&
                mock.rudderstack.has_identified &&
                current_page !== mock.rudderstack.current_page
            ) {
                mock.rudderstack.current_page = current_page;
            }
        };

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
            },
        });

        mock.rudderstack.reset = () => {
            mock.rudderstack.has_identified = false;
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useRudderstack(), { wrapper });

        act(() => {
            result.current.reset();
        });

        expect(mock.rudderstack.has_identified).toBe(false);
    });
});
