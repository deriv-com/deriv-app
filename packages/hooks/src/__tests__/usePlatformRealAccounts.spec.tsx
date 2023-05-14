import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import usePlatformRealAccounts from '../usePlatformRealAccounts';

describe('usePlatformRealAccounts', () => {
    test('should return null when user has no platform real accounts', async () => {
        const mock = mockStore({
            client: {
                accounts: {
                    VR1234: {
                        is_virtual: 1,
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => usePlatformRealAccounts(), { wrapper });

        expect(result.current).toHaveLength(0);
    });

    test('should return svg accounts when user has real account and switch to non-eu accounts', async () => {
        const mock = mockStore({
            traders_hub: {
                is_eu_user: false,
            },
            client: {
                accounts: {
                    CR1234: {
                        is_virtual: 0,
                        loginid: 'VR1234',
                        landing_company_shortcode: 'svg',
                    },
                    MF1234: {
                        is_virtual: 0,
                        loginid: 'VR1234',
                        landing_company_shortcode: 'maltainvest',
                    },
                    VR1235: {
                        is_virtual: 1,
                        loginid: 'VR1234',
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => usePlatformRealAccounts(), { wrapper });

        expect(result.current).toHaveLength(1);
        expect(result.current[0].landing_company_shortcode).toBe('svg');
    });

    test('should return maltainvest accounts when user has real account and switch to eu accounts', async () => {
        const mock = mockStore({
            traders_hub: {
                is_eu_user: true,
            },
            client: {
                accounts: {
                    CR1234: {
                        is_virtual: 0,
                        loginid: 'VR1234',
                        landing_company_shortcode: 'svg',
                    },
                    MF1234: {
                        is_virtual: 0,
                        loginid: 'VR1234',
                        landing_company_shortcode: 'maltainvest',
                    },
                    VR1235: {
                        is_virtual: 1,
                        loginid: 'VR1234',
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => usePlatformRealAccounts(), { wrapper });

        expect(result.current).toHaveLength(1);
        expect(result.current[0].landing_company_shortcode).toBe('maltainvest');
    });
});
