import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import useGetMFAccountStatus from '../useGetMFAccountStatus';

describe('useGetMFAccountStatus', () => {
    it('should return needs verification status if all the statuses are none', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        identity: {
                            services: {
                                onfido: {
                                    status: 'none',
                                },
                                manual: {
                                    status: 'none',
                                },
                            },
                        },
                        document: {
                            status: 'none',
                        },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useGetMFAccountStatus(), {
            wrapper,
        });

        expect(result.current).toBe('needs_verification');
    });

    it('should return failed if either of none, pending or verified statuses are not present', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        identity: {
                            services: {
                                onfido: {
                                    status: 'pending',
                                },
                                manual: {
                                    status: 'rejected',
                                },
                            },
                        },
                        document: {
                            status: 'suspected',
                        },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useGetMFAccountStatus(), {
            wrapper,
        });

        expect(result.current).toBe('failed');
    });

    it('should return pending if poa status is pending or verified status is not present in onfido or manual status', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        identity: {
                            services: {
                                onfido: {
                                    status: 'pending',
                                },
                                manual: {
                                    status: 'none',
                                },
                            },
                        },
                        document: {
                            status: 'suspected',
                        },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useGetMFAccountStatus(), {
            wrapper,
        });

        expect(result.current).toBe('failed');
    });
});
