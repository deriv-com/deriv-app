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

    test('should return correct authentication status for POA and POI documents when POA services are missing', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                        identity: {
                            status: 'none',
                            services: {
                                onfido: {
                                    status: 'none',
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
        expect(result.current.poa.not_submitted).toBe(true);
        expect(result.current.poi.not_submitted).toBe(true);
    });

    test('should return correct authentication status for POA and POI documents when POI services are missing', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                        identity: {
                            status: 'none',
                            services: {
                                manual: {
                                    status: 'none',
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

        expect(result.current.poa.not_submitted).toBe(true);
        expect(result.current.poi.not_submitted).toBe(true);
    });

    test('should return correct authentication status for POA and POI documents when POA and POI services are missing', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                        identity: {
                            status: 'none',
                            services: {},
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

    test('should return correct authentication status for POA and POI documents when POI service status is unknown', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                        identity: {
                            status: 'none',
                            services: {
                                manual: {
                                    status: undefined,
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

        expect(result.current.poa.not_submitted).toBe(true);
        expect(result.current.poi.not_submitted).toBe(true);
    });

    test('should return correct authentication status for POI documents for maltainvest jurisdiction', () => {
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
                                idv: {
                                    status: 'verified',
                                },
                                onfido: {
                                    status: 'none',
                                },
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

        expect(result.current.poi.maltainvest.verified).toBe(true);
        expect(result.current.poi.maltainvest.pending).toBe(false);
        expect(result.current.poi.maltainvest.not_submitted).toBe(false);
        expect(result.current.poi.maltainvest.need_submission).toBe(false);
        expect(result.current.poi.maltainvest.need_resubmission).toBe(false);
        expect(result.current.poi.maltainvest.acknowledged).toBe(true);
    });

    test('should return correct authentication status for maltainvest with IDV and Onfido verified', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        identity: {
                            services: {
                                idv: {
                                    status: 'verified',
                                },
                                onfido: {
                                    status: 'verified',
                                },
                                manual: {
                                    status: 'none',
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

        expect(result.current.poi.maltainvest.verified).toBe(true);
        expect(result.current.poi.maltainvest.pending).toBe(false);
        expect(result.current.poi.maltainvest.not_submitted).toBe(false);
        expect(result.current.poi.maltainvest.need_submission).toBe(false);
        expect(result.current.poi.maltainvest.need_resubmission).toBe(false);
        expect(result.current.poi.maltainvest.acknowledged).toBe(true);
    });

    test('should return correct authentication status for maltainvest with Onfido pending and IDV rejected', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        identity: {
                            services: {
                                idv: {
                                    status: 'rejected',
                                },
                                onfido: {
                                    status: 'pending',
                                },
                                manual: {
                                    status: 'none',
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

        expect(result.current.poi.maltainvest.verified).toBe(false);
        expect(result.current.poi.maltainvest.pending).toBe(true);
        expect(result.current.poi.maltainvest.not_submitted).toBe(false);
        expect(result.current.poi.maltainvest.need_submission).toBe(false);
        expect(result.current.poi.maltainvest.need_resubmission).toBe(false);
        expect(result.current.poi.maltainvest.acknowledged).toBe(true);
    });

    test('should return correct authentication status for maltainvest with Onfido and IDV not submitted', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        identity: {
                            services: {
                                idv: {
                                    status: 'none',
                                },
                                onfido: {
                                    status: 'none',
                                },
                                manual: {
                                    status: 'none',
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

        expect(result.current.poi.maltainvest.verified).toBe(false);
        expect(result.current.poi.maltainvest.pending).toBe(false);
        expect(result.current.poi.maltainvest.not_submitted).toBe(true);
        expect(result.current.poi.maltainvest.need_submission).toBe(true);
        expect(result.current.poi.maltainvest.need_resubmission).toBe(false);
        expect(result.current.poi.maltainvest.acknowledged).toBe(false);
    });

    test('should return correct authentication status for POI documents for bvi_labuan_vanuatu jurisdiction', () => {
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
                                idv: {
                                    status: 'verified',
                                },
                                onfido: {
                                    status: 'rejected',
                                },
                                manual: {
                                    status: 'none',
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

        expect(result.current.poi.bvi_labuan_vanuatu.verified).toBe(true);
        expect(result.current.poi.bvi_labuan_vanuatu.pending).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.not_submitted).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.need_submission).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.need_resubmission).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.acknowledged).toBe(true);
    });

    test('should return correct authentication status for bvi_labuan_vanuatu with IDV, Onfido, and Manual verified', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        identity: {
                            services: {
                                idv: {
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

        expect(result.current.poi.bvi_labuan_vanuatu.verified).toBe(true);
        expect(result.current.poi.bvi_labuan_vanuatu.pending).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.not_submitted).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.need_resubmission).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.acknowledged).toBe(true);
    });

    test('should return correct authentication status for bvi_labuan_vanuatu with Onfido and Manual pending and IDV rejected', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        identity: {
                            status: 'pending',
                            services: {
                                idv: {
                                    status: 'rejected',
                                },
                                onfido: {
                                    status: 'pending',
                                },
                                manual: {
                                    status: 'none',
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

        expect(result.current.poi.bvi_labuan_vanuatu.verified).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.pending).toBe(true);
        expect(result.current.poi.bvi_labuan_vanuatu.not_submitted).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.need_submission).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.need_resubmission).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.acknowledged).toBe(true);
    });

    test('should return correct authentication status for bvi_labuan_vanuatu with Onfido and Manual not submitted and IDV rejected', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        identity: {
                            status: 'rejected',
                            services: {
                                idv: {
                                    status: 'rejected',
                                },
                                onfido: {
                                    status: 'none',
                                },
                                manual: {
                                    status: 'none',
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

        expect(result.current.poi.bvi_labuan_vanuatu.verified).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.pending).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.not_submitted).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.need_resubmission).toBe(true);
        expect(result.current.poi.bvi_labuan_vanuatu.acknowledged).toBe(false);
    });
});
