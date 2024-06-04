import { renderHook } from '@testing-library/react-hooks';
import useQuery from '../../useQuery';
import useClientCountry from '../useClientCountry';

jest.mock('../../useQuery');

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery<'website_status'>>;

describe('useClientCountry', () => {
    it('should return an undefined', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseQuery.mockReturnValue({
            data: {
                website_status: undefined,
            },
        });
        const { result } = renderHook(() => useClientCountry());

        expect(result.current.data).toBeUndefined();
    });

    it('should return Indonesia country code', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseQuery.mockReturnValue({
            data: {
                website_status: {
                    api_call_limits: {
                        max_proposal_subscription: {
                            applies_to: '',
                            max: 0,
                        },
                        max_requestes_general: {
                            applies_to: '',
                            hourly: 0,
                            minutely: 0,
                        },
                        max_requests_outcome: {
                            applies_to: '',
                            hourly: 0,
                            minutely: 0,
                        },
                        max_requests_pricing: {
                            applies_to: '',
                            hourly: 0,
                            minutely: 0,
                        },
                    },
                    currencies_config: {},
                    clients_country: 'id',
                },
            },
        });
        const { result } = renderHook(() => useClientCountry());
        expect(result.current.data).toBe('id');
    });
});
