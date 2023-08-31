import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { APIProvider, useGetAccountStatus } from '@deriv/api';
import useAuthenticationStatusInfo from '../useAuthenticationStatusInfo';
import useIsAccountStatusPresent from '../useIsAccountStatusPresent';
// import useAccountStatus from '../useAccountStatus';

jest.mock('../useIsAccountStatusPresent.ts', () => jest.fn());

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useGetAccountStatus: jest.fn(),
}));

const mockUseAccountStatus = useGetAccountStatus as jest.MockedFunction<typeof useGetAccountStatus>;
const mockUseIsAccountStatusPresent = useIsAccountStatusPresent as jest.MockedFunction<
    typeof useIsAccountStatusPresent
>;

describe('useAuthenticationStatusInfo', () => {
    const mockAccountStatus = {
        authentication: {
            attempts: {
                count: 1,
                history: [
                    {
                        country_code: 'id',
                        id: '8919',
                        service: 'manual',
                        status: 'verified',
                        timestamp: 1674633681,
                    },
                ],
                latest: {
                    country_code: 'id',
                    id: '8919',
                    service: 'manual',
                    status: 'verified',
                    timestamp: 1674633681,
                },
            },
            document: {
                status: 'none',
            },

            identity: {
                services: {
                    idv: {
                        last_rejected: [],
                        reported_properties: {},
                        status: 'none',
                        submissions_left: 3,
                    },
                    manual: {
                        status: 'none',
                    },
                    onfido: {
                        country_code: 'IDN',
                        documents_supported: [
                            'Driving Licence',
                            'National Identity Card',
                            'Passport',
                            'Residence Permit',
                        ],
                        is_country_supported: 1,
                        last_rejected: [],
                        reported_properties: {},
                        status: 'none',
                        submissions_left: 3,
                    },
                },
                status: 'none',
            },
            needs_verification: [],
        },
        risk_classification: 'low',
        status: [
            'age_verification',
            'allow_document_upload',
            'authenticated',
            'dxtrade_password_not_set',
            'financial_information_not_complete',
            'idv_disallowed',
            'mt5_password_not_set',
            'trading_experience_not_complete',
        ],
    };

    it('should return correct authentication status for POA and POI documents when none of them are submitted', () => {
        mockUseAccountStatus.mockReturnValueOnce({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: mockAccountStatus,
        });

        mockUseIsAccountStatusPresent.mockReturnValueOnce(true);

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.poa.status).toBe('none');
        expect(result.current.poi.status).toBe('none');
    });

    test('should return correct authentication status for POA and POI documents when POA is pending and POI is verified', () => {
        mockAccountStatus.authentication.document.status = 'pending';
        mockAccountStatus.authentication.identity.status = 'verified';

        mockUseAccountStatus.mockReturnValueOnce({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: mockAccountStatus,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.poa.status).toBe('pending');
        expect(result.current.poi.status).toBe('verified');
    });

    test('should return correct authentication status for POA and POI documents when POA and POI services are missing', () => {
        mockAccountStatus.authentication.document.status = 'none';
        // @ts-expect-error need to check by not providing services
        mockAccountStatus.authentication.identity.status = undefined;

        mockUseAccountStatus.mockReturnValueOnce({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: mockAccountStatus,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.poa.status).toBe('none');
        expect(result.current.poi.status).toBe(undefined);
    });

    test('should return correct authentication status for POI documents for maltainvest jurisdiction', () => {
        mockAccountStatus.authentication.document.status = 'verified';
        mockAccountStatus.authentication.identity.status = 'verified';
        mockAccountStatus.authentication.identity.services.manual.status = 'verified';
        mockAccountStatus.authentication.identity.services.onfido.status = 'none';
        mockAccountStatus.authentication.identity.services.idv.status = 'verified';
        mockUseAccountStatus.mockReturnValueOnce({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: mockAccountStatus,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.poi.maltainvest.verified).toBe(true);
        expect(result.current.poi.maltainvest.pending).toBe(false);
        expect(result.current.poi.maltainvest.not_submitted).toBe(false);
        expect(result.current.poi.maltainvest.need_submission).toBe(false);
        expect(result.current.poi.maltainvest.need_resubmission).toBe(false);
        expect(result.current.poi.maltainvest.acknowledged).toBe(true);
    });

    test('should return correct authentication status for maltainvest with IDV and Onfido verified', () => {
        mockAccountStatus.authentication.identity.services.idv.status = 'verified';
        mockAccountStatus.authentication.identity.services.onfido.status = 'verified';
        mockAccountStatus.authentication.identity.services.manual.status = 'none';
        mockAccountStatus.authentication.identity.status = 'verified';
        mockUseAccountStatus.mockReturnValueOnce({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: mockAccountStatus,
        });
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.poi.maltainvest.verified).toBe(true);
        expect(result.current.poi.maltainvest.pending).toBe(false);
        expect(result.current.poi.maltainvest.not_submitted).toBe(false);
        expect(result.current.poi.maltainvest.need_submission).toBe(false);
        expect(result.current.poi.maltainvest.need_resubmission).toBe(false);
        expect(result.current.poi.maltainvest.acknowledged).toBe(true);
    });

    test('should return correct authentication status for maltainvest with Onfido pending and IDV rejected', () => {
        mockAccountStatus.authentication.identity.services.idv.status = 'rejected';
        mockAccountStatus.authentication.identity.services.onfido.status = 'pending';
        mockAccountStatus.authentication.identity.services.manual.status = 'none';
        mockAccountStatus.authentication.identity.status = 'pending';
        mockUseAccountStatus.mockReturnValueOnce({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: mockAccountStatus,
        });
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.poi.maltainvest.verified).toBe(false);
        expect(result.current.poi.maltainvest.pending).toBe(true);
        expect(result.current.poi.maltainvest.not_submitted).toBe(false);
        expect(result.current.poi.maltainvest.need_submission).toBe(false);
        expect(result.current.poi.maltainvest.need_resubmission).toBe(false);
        expect(result.current.poi.maltainvest.acknowledged).toBe(true);
    });

    test('should return correct authentication status for maltainvest with Onfido and IDV not submitted', () => {
        mockAccountStatus.authentication.identity.services.idv.status = 'none';
        mockAccountStatus.authentication.identity.services.onfido.status = 'none';
        mockAccountStatus.authentication.identity.services.manual.status = 'none';
        mockAccountStatus.authentication.identity.status = 'none';

        mockUseAccountStatus.mockReturnValueOnce({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: mockAccountStatus,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.poi.maltainvest.verified).toBe(false);
        expect(result.current.poi.maltainvest.pending).toBe(false);
        expect(result.current.poi.maltainvest.not_submitted).toBe(true);
        expect(result.current.poi.maltainvest.need_submission).toBe(true);
        expect(result.current.poi.maltainvest.need_resubmission).toBe(false);
        expect(result.current.poi.maltainvest.acknowledged).toBe(false);
    });

    test('should return correct authentication status for POI documents for bvi_labuan_vanuatu jurisdiction', () => {
        mockAccountStatus.authentication.document.status = 'verified';
        mockAccountStatus.authentication.identity.status = 'verified';
        mockAccountStatus.authentication.identity.services.manual.status = 'verified';
        mockAccountStatus.authentication.identity.services.onfido.status = 'none';
        mockAccountStatus.authentication.identity.services.idv.status = 'verified';
        mockUseAccountStatus.mockReturnValueOnce({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: mockAccountStatus,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.poi.bvi_labuan_vanuatu.verified).toBe(true);
        expect(result.current.poi.bvi_labuan_vanuatu.pending).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.not_submitted).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.need_submission).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.need_resubmission).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.acknowledged).toBe(true);
    });

    test('should return correct authentication status for bvi_labuan_vanuatu with IDV, Onfido, and Manual verified', () => {
        mockAccountStatus.authentication.identity.services.idv.status = 'verified';
        mockAccountStatus.authentication.identity.status = 'verified';

        mockUseAccountStatus.mockReturnValueOnce({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: mockAccountStatus,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.poi.bvi_labuan_vanuatu.verified).toBe(true);
        expect(result.current.poi.bvi_labuan_vanuatu.pending).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.not_submitted).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.need_resubmission).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.acknowledged).toBe(true);
    });

    test('should return correct authentication status for bvi_labuan_vanuatu with Onfido and Manual pending and IDV rejected', () => {
        mockAccountStatus.authentication.identity.services.idv.status = 'rejected';
        mockAccountStatus.authentication.identity.services.onfido.status = 'pending';
        mockAccountStatus.authentication.identity.services.manual.status = 'none';
        mockAccountStatus.authentication.identity.status = 'pending';

        mockUseAccountStatus.mockReturnValueOnce({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: mockAccountStatus,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.poi.bvi_labuan_vanuatu.verified).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.pending).toBe(true);
        expect(result.current.poi.bvi_labuan_vanuatu.not_submitted).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.need_submission).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.need_resubmission).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.acknowledged).toBe(true);
    });

    test('should return correct authentication status for bvi_labuan_vanuatu with Onfido and Manual not submitted and IDV rejected', () => {
        mockAccountStatus.authentication.identity.services.idv.status = 'rejected';
        mockAccountStatus.authentication.identity.services.onfido.status = 'none';
        mockAccountStatus.authentication.identity.services.manual.status = 'none';
        mockAccountStatus.authentication.identity.status = 'rejected';

        mockUseAccountStatus.mockReturnValueOnce({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: mockAccountStatus,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.poi.bvi_labuan_vanuatu.verified).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.pending).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.not_submitted).toBe(false);
        expect(result.current.poi.bvi_labuan_vanuatu.need_resubmission).toBe(true);
        expect(result.current.poi.bvi_labuan_vanuatu.acknowledged).toBe(false);
    });

    test('should return correct  aythentication for triggering IDV resubmit', () => {
        mockUseIsAccountStatusPresent.mockReturnValueOnce(false);

        mockUseAccountStatus.mockReturnValueOnce({
            // @ts-expect-error need to come up with a way to mock the return type of useFetch
            data: mockAccountStatus,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAuthenticationStatusInfo(), { wrapper });

        expect(result.current.is_idv_revoked).toBeFalsy();
    });
});
