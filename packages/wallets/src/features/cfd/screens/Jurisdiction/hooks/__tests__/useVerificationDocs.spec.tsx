import { usePOI, useResidenceList } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import useVerificationDocs from '../useVerificationDocs';

jest.mock('@deriv/api-v2', () => ({
    usePOI: jest.fn(),
    useResidenceList: jest.fn(),
}));

const mockUsePOI = usePOI as jest.MockedFunction<typeof usePOI>;
const mockUseResidenceList = useResidenceList as jest.MockedFunction<typeof useResidenceList>;

describe('useVerificationDocs', () => {
    it('should return onfido/manual verification docs for idv unsupported country', () => {
        mockUsePOI.mockReturnValue({
            // @ts-expect-error need a way to mock useQuery data
            data: {
                current: {
                    country_code: 'id',
                    service: 'onfido',
                    status: 'none',
                },
                services: {
                    onfido: {
                        submissions_left: 1,
                    },
                },
            },
        });
        mockUseResidenceList.mockReturnValue(
            // @ts-expect-error need a way to mock useQuery data
            {
                data: [
                    {
                        identity: {
                            services: {
                                idv: {
                                    is_country_supported: 0,
                                },
                            },
                        },
                        value: 'id',
                    },
                ],
            }
        );
        const { result } = renderHook(() => useVerificationDocs('bvi'));
        expect(result.current).toEqual({
            financial: ['selfie', 'identityDocument', 'nameAndAddress'],
            synthetic: ['selfie', 'identityDocument', 'nameAndAddress'],
        });
    });

    it('should return idv verification docs for idv supported country and client has idv attempts left', () => {
        mockUsePOI.mockReturnValue({
            // @ts-expect-error need a way to mock useQuery data
            data: {
                current: {
                    country_code: 'co',
                    service: 'idv',
                    status: 'none',
                },
                services: {
                    idv: {
                        submissions_left: 1,
                    },
                },
            },
        });
        mockUseResidenceList.mockReturnValue(
            // @ts-expect-error need a way to mock useQuery data
            {
                data: [
                    {
                        identity: {
                            services: {
                                idv: {
                                    is_country_supported: 1,
                                },
                            },
                        },
                        value: 'co',
                    },
                ],
            }
        );
        const { result } = renderHook(() => useVerificationDocs('bvi'));
        expect(result.current).toEqual({
            financial: ['documentNumber', 'nameAndAddress'],
            synthetic: ['documentNumber', 'nameAndAddress'],
        });
    });

    it('should return onfido/manual verification docs for idv supported country with no attempts left', () => {
        mockUsePOI.mockReturnValue({
            // @ts-expect-error need a way to mock useQuery data
            data: {
                current: {
                    country_code: 'co',
                    service: 'idv',
                    status: 'none',
                },
                services: {
                    idv: {
                        submissions_left: 0,
                    },
                },
            },
        });
        mockUseResidenceList.mockReturnValue(
            // @ts-expect-error need a way to mock useQuery data
            {
                data: [
                    {
                        identity: {
                            services: {
                                idv: {
                                    is_country_supported: 1,
                                },
                            },
                        },
                        value: 'co',
                    },
                ],
            }
        );
        const { result } = renderHook(() => useVerificationDocs('bvi'));
        expect(result.current).toEqual({
            financial: ['selfie', 'identityDocument', 'nameAndAddress'],
            synthetic: ['selfie', 'identityDocument', 'nameAndAddress'],
        });
    });

    it('should return verification docs for unregulated jurisdiction', () => {
        mockUsePOI.mockReturnValue({
            // @ts-expect-error need a way to mock useQuery data
            data: {
                current: {
                    country_code: 'co',
                    service: 'idv',
                    status: 'none',
                },
                services: {
                    idv: {
                        submissions_left: 0,
                    },
                },
            },
        });
        mockUseResidenceList.mockReturnValue(
            // @ts-expect-error need a way to mock useQuery data
            {
                data: [
                    {
                        identity: {
                            services: {
                                idv: {
                                    is_country_supported: 1,
                                },
                            },
                        },
                        value: 'co',
                    },
                ],
            }
        );
        const { result } = renderHook(() => useVerificationDocs('svg'));
        expect(result.current).toEqual({
            financial: ['notApplicable'],
            synthetic: ['notApplicable'],
        });
    });
});
