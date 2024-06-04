import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useAuthentication from '../hooks/useAuthentication';
import usePOI from '../hooks/usePOI';
import useJurisdictionStatus from '../hooks/useJurisdictionStatus';
import APIProvider from '../APIProvider';
import AuthProvider from '../AuthProvider';

jest.mock('@deriv/shared');
jest.mock('../hooks/useAuthentication');
jest.mock('../hooks/usePOI');

const mockUseAuthentication = useAuthentication as jest.MockedFunction<typeof useAuthentication>;
const mockUsePOI = usePOI as jest.MockedFunction<typeof usePOI>;

describe('useJurisdictionStatus', () => {
    test('for BVI/Labuan, should have a failed verification status if MT5 account status has failed and IDV status is rejected', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );
        mockUsePOI.mockReturnValue({
            data: {
                services: {
                    idv: {
                        status: 'rejected',
                    },
                },
                // @ts-expect-error This is just for mocking, we just need to mock some properties only
                current: {
                    service: 'idv',
                },
            },
        });
        mockUseAuthentication.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                is_idv_revoked: false,
            },
        });
        const { result } = renderHook(() => useJurisdictionStatus(), { wrapper });
        const data = result.current.getVerificationStatus('bvi', 'proof_failed');
        expect(data.is_failed).toBe(true);
        expect(data.is_not_applicable).toBe(false);
        expect(data.is_pending).toBe(false);

        const labuanData = result.current.getVerificationStatus('labuan', 'proof_failed');
        expect(labuanData.is_failed).toBe(true);
        expect(labuanData.is_not_applicable).toBe(false);
        expect(labuanData.is_pending).toBe(false);
    });
    test('for BVI/Labuan, should have a pending verification status if MT5 account status is currently pending verification and IDV status is pending', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );
        mockUsePOI.mockReturnValue({
            data: {
                services: {
                    idv: {
                        status: 'pending',
                    },
                },
                // @ts-expect-error This is just for mocking, we just need to mock some properties onl
                current: {
                    service: 'idv',
                },
            },
        });
        mockUseAuthentication.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                is_idv_revoked: false,
            },
        });
        const { result } = renderHook(() => useJurisdictionStatus(), { wrapper });
        const data = result.current.getVerificationStatus('bvi', 'verification_pending');
        expect(data.is_failed).toBe(false);
        expect(data.is_not_applicable).toBe(false);
        expect(data.is_pending).toBe(true);
        expect(data.is_verified).toBe(false);

        const labuanData = result.current.getVerificationStatus('labuan', 'verification_pending');
        expect(labuanData.is_failed).toBe(false);
        expect(labuanData.is_not_applicable).toBe(false);
        expect(labuanData.is_pending).toBe(true);
        expect(data.is_verified).toBe(false);
    });
    test('for BVI/Labuan, should have a pending verification status if IDV attempts failed and the next compatible service Onfido is pending', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );
        mockUseAuthentication.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                is_idv_revoked: false,
            },
        });
        mockUsePOI.mockReturnValue({
            data: {
                services: {
                    idv: {
                        status: 'rejected',
                    },
                    onfido: {
                        status: 'pending',
                    },
                },
                // @ts-expect-error This is just for mocking, we just need to mock some properties only
                current: {
                    service: 'onfido',
                },
            },
        });
        const { result } = renderHook(() => useJurisdictionStatus(), { wrapper });
        const data = result.current.getVerificationStatus('bvi', 'verification_pending');
        expect(data.is_failed).toBe(false);
        expect(data.is_not_applicable).toBe(false);
        expect(data.is_pending).toBe(true);
        expect(data.is_verified).toBe(false);

        const labuanData = result.current.getVerificationStatus('labuan', 'verification_pending');
        expect(labuanData.is_failed).toBe(false);
        expect(labuanData.is_not_applicable).toBe(false);
        expect(labuanData.is_pending).toBe(true);
        expect(data.is_verified).toBe(false);
    });
    test('for BVI/Labuan, should have a failed verification status if IDV is revoked', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );
        mockUsePOI.mockReturnValue({
            data: {
                services: {
                    idv: {
                        status: 'none',
                    },
                },
                // @ts-expect-error This is just for mocking, we just need to mock some properties only
                current: {
                    service: 'idv',
                },
            },
        });
        mockUseAuthentication.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                is_idv_revoked: true,
            },
        });
        const { result } = renderHook(() => useJurisdictionStatus(), { wrapper });
        const data = result.current.getVerificationStatus('bvi', 'verification_pending');
        expect(data.is_failed).toBe(true);
        expect(data.is_not_applicable).toBe(false);
        expect(data.is_pending).toBe(false);
        expect(data.is_verified).toBe(false);

        const labuanData = result.current.getVerificationStatus('labuan', 'verification_pending');
        expect(labuanData.is_failed).toBe(true);
        expect(labuanData.is_not_applicable).toBe(false);
        expect(labuanData.is_pending).toBe(false);
        expect(data.is_verified).toBe(false);
    });

    test('for BVI/Labuan, should have a verified verification status if IDV is verified', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );
        mockUsePOI.mockReturnValue({
            data: {
                services: {
                    idv: {
                        status: 'verified',
                    },
                },
                // @ts-expect-error This is just for mocking, we just need to mock some properties only
                current: {
                    service: 'idv',
                },
            },
        });
        mockUseAuthentication.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                is_idv_revoked: false,
            },
        });
        const { result } = renderHook(() => useJurisdictionStatus(), { wrapper });
        const data = result.current.getVerificationStatus('bvi', 'verified');
        expect(data.is_failed).toBe(false);
        expect(data.is_not_applicable).toBe(false);
        expect(data.is_pending).toBe(false);
        expect(data.is_verified).toBe(true);

        const labuanData = result.current.getVerificationStatus('labuan', 'verified');
        expect(labuanData.is_failed).toBe(false);
        expect(labuanData.is_not_applicable).toBe(false);
        expect(labuanData.is_pending).toBe(false);
        expect(data.is_verified).toBe(true);
    });

    test('for Labuan, should have a failed verification status if is_authenticated_with_idv_photoid is present in account status', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );
        mockUsePOI.mockReturnValue({
            data: {
                services: {
                    idv: {
                        status: 'verified',
                    },
                },
                // @ts-expect-error This is just for mocking, we just need to mock some properties only
                current: {
                    service: 'idv',
                },
            },
        });
        mockUseAuthentication.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                is_authenticated_with_idv_photoid: true,
            },
        });
        const { result } = renderHook(() => useJurisdictionStatus(), { wrapper });
        const data = result.current.getVerificationStatus('labuan', 'verification_pending');
        expect(data.is_failed).toBe(true);
        expect(data.is_not_applicable).toBe(false);
        expect(data.is_pending).toBe(false);
        expect(data.is_verified).toBe(false);
    });
    test('for SVG, status should not be applicable', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );
        mockUsePOI.mockReturnValue({
            data: {
                services: {
                    idv: {
                        status: 'none',
                    },
                },
                // @ts-expect-error This is just for mocking, we just need to mock some properties only
                current: {
                    service: 'idv',
                },
            },
        });
        mockUseAuthentication.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                is_idv_revoked: true,
            },
        });
        const { result } = renderHook(() => useJurisdictionStatus(), { wrapper });
        const data = result.current.getVerificationStatus('svg', 'verification_pending');
        expect(data.is_failed).toBe(false);
        expect(data.is_not_applicable).toBe(true);
        expect(data.is_pending).toBe(false);
        expect(data.is_verified).toBe(false);
    });
    test('for Vanuatu, status should be failed if MT5 account status is proof_failed', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useJurisdictionStatus(), { wrapper });
        const data = result.current.getVerificationStatus('vanuatu', 'proof_failed');
        expect(data.is_failed).toBe(true);
        expect(data.is_not_applicable).toBe(false);
        expect(data.is_pending).toBe(false);
    });
    test('for Vanuatu, status should be pending if MT5 account status is verification_pending', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useJurisdictionStatus(), { wrapper });
        const data = result.current.getVerificationStatus('vanuatu', 'verification_pending');
        expect(data.is_failed).toBe(false);
        expect(data.is_not_applicable).toBe(false);
        expect(data.is_pending).toBe(true);
        expect(data.is_verified).toBe(false);
    });
    test('for Vanuatu, status should not be failed/pending if MT5 account status is not equal to proof_failed or verification_pending', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useJurisdictionStatus(), { wrapper });
        const data = result.current.getVerificationStatus('vanuatu', 'none');
        expect(data.is_failed).toBe(false);
        expect(data.is_not_applicable).toBe(false);
        expect(data.is_pending).toBe(false);
        expect(data.is_verified).toBe(false);
    });

    test('for Vanuatu, should have a verified verification status if IDV is verified', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );
        mockUsePOI.mockReturnValue({
            data: {
                services: {
                    idv: {
                        status: 'verified',
                    },
                },
                // @ts-expect-error This is just for mocking, we just need to mock some properties only
                current: {
                    service: 'idv',
                },
            },
        });
        mockUseAuthentication.mockReturnValue({
            // @ts-expect-error This is just for mocking, we just need to mock some properties only
            data: {
                is_idv_revoked: false,
            },
        });
        const { result } = renderHook(() => useJurisdictionStatus(), { wrapper });
        const data = result.current.getVerificationStatus('vanuatu', 'verified');
        expect(data.is_failed).toBe(false);
        expect(data.is_not_applicable).toBe(false);
        expect(data.is_pending).toBe(false);
        expect(data.is_verified).toBe(true);
    });
});
