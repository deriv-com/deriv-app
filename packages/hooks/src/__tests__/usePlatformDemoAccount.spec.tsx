import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import usePlatformDemoAccount from '../usePlatformDemoAccount';

describe('usePlatformDemoAccount', () => {
    test('should return undefined when user has no platform demo accounts', async () => {
        const mock = mockStore({
            client: {
                accounts: {
                    VR1234: {
                        is_virtual: 0,
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => usePlatformDemoAccount(), { wrapper });

        expect(result.current).toBe(undefined);
    });

    test('should return proper data when user has platform demo account', async () => {
        const mock = mockStore({
            client: {
                accounts: {
                    VR1234: {
                        is_virtual: 1,
                        loginid: 'VR1234',
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => usePlatformDemoAccount(), { wrapper });

        expect(result.current?.loginid).toBe(mock.client.accounts.VR1234.loginid);
    });
});
