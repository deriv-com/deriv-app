import { renderHook } from '@testing-library/react-hooks';
import useAccountStatus from '../useAccountStatus';
import useCheck10kLimit from '../useCheck10kLimit';
import { useFetch } from '@deriv/api';

const mock_get_account_status = {
    get_account_status: {
        authentication: {
            identity: {
                status: 'none',
            },
        },
        cashier_validation: [],
        status: [],
    },
};

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

jest.mock('../useCheck10kLimit', () => {
    return jest.fn();
});

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch>;
const mockUseCheck10kLimit = useCheck10kLimit as jest.MockedFunction<typeof useCheck10kLimit>;

describe('useAccountStatus', () => {
    beforeEach(() => {
        mockUseCheck10kLimit.mockReturnValue({
            is_10k_withdrawal_limit_reached: false,
            max_withdraw_amount: 10,
        });
    });

    it('should check whether POI is needed', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                get_account_status: {
                    authentication: {
                        identity: {
                            status: 'none',
                        },
                    },
                },
            },
        });

        mockUseCheck10kLimit.mockReturnValue({
            is_10k_withdrawal_limit_reached: true,
            max_withdraw_amount: 10,
        });
        const { result } = renderHook(useAccountStatus);
        const { statuses } = result.current;

        expect(statuses.needs_verification.is_poi_needed).toBe(true);
    });

    it('should check whether POI is not needed', () => {
        mockUseCheck10kLimit.mockReturnValue({
            is_10k_withdrawal_limit_reached: true,
            max_withdraw_amount: 10,
        });
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                get_account_status: {
                    authentication: {
                        identity: {
                            status: 'verified',
                        },
                    },
                },
            },
        });
        const { result: result_1 } = renderHook(useAccountStatus);
        const { statuses: statuses_1 } = result_1.current;

        expect(statuses_1.needs_verification.is_poi_needed).toBe(false);

        mockUseCheck10kLimit.mockReturnValue({
            is_10k_withdrawal_limit_reached: false,
            max_withdraw_amount: 10,
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                get_account_status: {
                    authentication: {
                        identity: {
                            status: 'none',
                        },
                    },
                },
            },
        });

        const { result: result_2 } = renderHook(useAccountStatus);
        const { statuses: statuses_2 } = result_2.current;

        expect(statuses_2.needs_verification.is_poi_needed).toBe(false);
    });

    it('should check whether POI documents are submitted', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                get_account_status: {
                    authentication: {
                        identity: {
                            status: 'verified',
                        },
                    },
                },
            },
        });

        const { result } = renderHook(useAccountStatus);

        expect(result.current.statuses.document.has_poi_submitted).toBe(true);
    });

    it('should check whether POI documents are not submitted', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                get_account_status: {
                    authentication: {
                        identity: {
                            status: 'none',
                        },
                    },
                },
            },
        });

        const { result } = renderHook(useAccountStatus);

        expect(result.current.statuses.document.has_poi_submitted).toBe(false);
    });

    it('should check whether POA is not needed', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                get_account_status: {
                    authentication: {
                        needs_verification: [],
                        document: {
                            status: 'verified',
                        },
                    },
                },
            },
        });

        mockUseCheck10kLimit.mockReturnValue({
            is_10k_withdrawal_limit_reached: true,
            max_withdraw_amount: 10,
        });

        const { result: result_1 } = renderHook(useAccountStatus);

        expect(result_1.current.statuses.needs_verification.is_poa_needed).toBe(false);

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                get_account_status: {
                    authentication: {
                        needs_verification: ['document'],
                        document: {
                            status: 'none',
                        },
                    },
                },
            },
        });

        mockUseCheck10kLimit.mockReturnValue({
            is_10k_withdrawal_limit_reached: false,
            max_withdraw_amount: 10,
        });

        const { result: result_2 } = renderHook(useAccountStatus);

        expect(result_2.current.statuses.needs_verification.is_poa_needed).toBe(false);
    });

    it('should check whether POA is needed if document is needed', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                get_account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                    },
                },
            },
        });

        mockUseCheck10kLimit.mockReturnValue({
            is_10k_withdrawal_limit_reached: true,
            max_withdraw_amount: 10,
        });

        const { result: result_1 } = renderHook(useAccountStatus);

        expect(result_1.current.statuses.needs_verification.is_poa_needed).toBe(true);

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                get_account_status: {
                    authentication: {
                        needs_verification: ['document'],
                    },
                },
            },
        });

        const { result: result_2 } = renderHook(useAccountStatus);

        expect(result_2.current.statuses.needs_verification.is_poa_needed).toBe(true);
    });

    it('should check whether POA documents are not submitted', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                get_account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                    },
                },
            },
        });
        const { result } = renderHook(useAccountStatus);

        expect(result.current.statuses.document.has_poa_submitted).toBe(false);
    });

    it('should check whether POA documents are submitted', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({
            data: {
                get_account_status: {
                    authentication: {
                        document: {
                            status: 'verified',
                        },
                    },
                },
            },
        });

        const { result } = renderHook(useAccountStatus);

        expect(result.current.statuses.document.has_poa_submitted).toBe(true);
    });
});
