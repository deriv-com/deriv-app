import { renderHook } from '@testing-library/react-hooks';
import useAccountStatus from '../useAccountStatus';
import useIsWithdrawalLimitReached from '../useIsWithdrawalLimitReached';
import { useFetch } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

jest.mock('../useIsWithdrawalLimitReached', () => {
    return jest.fn();
});

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch>;
const mockUseIsWithdrawalLimitReached = useIsWithdrawalLimitReached as jest.MockedFunction<
    typeof useIsWithdrawalLimitReached
>;

describe('useAccountStatus', () => {
    beforeEach(() => {
        mockUseIsWithdrawalLimitReached.mockReturnValue({
            is_10k_withdrawal_limit_reached: false,
            max_withdraw_amount: 10,
            isSuccess: true,
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

        mockUseIsWithdrawalLimitReached.mockReturnValue({
            is_10k_withdrawal_limit_reached: true,
            max_withdraw_amount: 10,
            isSuccess: true,
        });
        const { result } = renderHook(useAccountStatus);
        const { statuses } = result.current;

        expect(statuses.needs_verification.is_poi_needed).toBe(true);
    });

    it('should check whether POI is not needed', () => {
        mockUseIsWithdrawalLimitReached.mockReturnValue({
            is_10k_withdrawal_limit_reached: true,
            max_withdraw_amount: 10,
            isSuccess: true,
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
        const { result, rerender } = renderHook(useAccountStatus);
        const { statuses } = result.current;

        expect(statuses.needs_verification.is_poi_needed).toBe(false);

        mockUseIsWithdrawalLimitReached.mockReturnValue({
            is_10k_withdrawal_limit_reached: false,
            max_withdraw_amount: 10,
            isSuccess: true,
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

        rerender();

        expect(statuses.needs_verification.is_poi_needed).toBe(false);
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

        mockUseIsWithdrawalLimitReached.mockReturnValue({
            is_10k_withdrawal_limit_reached: true,
            max_withdraw_amount: 10,
            isSuccess: true,
        });

        const { result, rerender } = renderHook(useAccountStatus);

        expect(result.current.statuses.needs_verification.is_poa_needed).toBe(false);

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

        mockUseIsWithdrawalLimitReached.mockReturnValue({
            is_10k_withdrawal_limit_reached: false,
            max_withdraw_amount: 10,
            isSuccess: true,
        });

        rerender();

        expect(result.current.statuses.needs_verification.is_poa_needed).toBe(false);
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

        mockUseIsWithdrawalLimitReached.mockReturnValue({
            is_10k_withdrawal_limit_reached: true,
            max_withdraw_amount: 10,
            isSuccess: true,
        });

        const { result, rerender } = renderHook(useAccountStatus);

        expect(result.current.statuses.needs_verification.is_poa_needed).toBe(true);

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

        rerender();

        expect(result.current.statuses.needs_verification.is_poa_needed).toBe(true);
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
