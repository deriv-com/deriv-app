import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import usePlatformAccounts from '../usePlatformAccounts';

describe('usePlatformRealAccounts', () => {
    test('should return proper data when user has no platform demo and real accounts', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => usePlatformAccounts(), { wrapper });

        expect(result.current.demo).toBe(undefined);
        expect(result.current.real.length).toBe(0);
    });

    test('should return proper data when user only has platform demo account', async () => {
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
        const { result } = renderHook(() => usePlatformAccounts(), { wrapper });

        expect(result.current.demo?.loginid).toBe(mock.client.accounts.VR1234.loginid);
        expect(result.current.real.length).toBe(0);
    });

    test('should return proper data when user only has platform real account', async () => {
        const mock = mockStore({
            client: {
                accounts: {
                    CR1234: {
                        is_virtual: 0,
                        loginid: 'CR1234',
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => usePlatformAccounts(), { wrapper });

        expect(result.current.demo?.loginid).toBe(undefined);
        expect(result.current.real.length).toBe(1);
    });

    test('should return proper data when user has both real and demo accounts', async () => {
        const mock = mockStore({
            client: {
                accounts: {
                    CR1234: {
                        is_virtual: 0,
                        loginid: 'VR1234',
                        landing_company_shortcode: 'svg',
                    },
                    MF1234: {
                        is_virtual: 0,
                        loginid: 'VR1235',
                        landing_company_shortcode: 'maltainvest',
                    },
                    VR1235: {
                        is_virtual: 1,
                        loginid: 'VR1236',
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => usePlatformAccounts(), { wrapper });

        expect(result.current.demo?.loginid).toBe(mock.client.accounts.VR1235.loginid);
        expect(result.current.real.length).toBe(1);
        expect(result.current.real[0].landing_company_shortcode).toBe('svg');
    });
});
