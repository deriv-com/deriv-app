import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useAuthenticationStatusInfo from '../useAuthenticationStatusInfo';

describe('useAuthenticationStatusInfo', () => {
    test('should return correct authentication status for POA and POI documents when none of them are submitted', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                        identity: {
                            status: 'none',
                        },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.poa.not_submitted).toBe(true);
        expect(result.current.poi.not_submitted).toBe(true);
    });

    test('should return correct authentication status for POA and POI documents when POA is pending and POI is verified', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'pending',
                        },
                        identity: {
                            status: 'verified',
                            services: {
                                manual: {
                                    status: 'verified',
                                },
                            },
                        },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.poa.pending).toBe(true);
        expect(result.current.poi.verified).toBe(true);
    });

    test('should return correct authentication status for POA and POI documents when both POA and POI are verified', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'verified',
                        },
                        identity: {
                            status: 'verified',
                            services: {
                                manual: {
                                    status: 'verified',
                                },
                            },
                        },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.poa.verified).toBe(true);
        expect(result.current.poi.verified).toBe(true);
    });
});
