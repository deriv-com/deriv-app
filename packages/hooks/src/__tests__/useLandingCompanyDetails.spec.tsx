import { renderHook } from '@testing-library/react-hooks';
import useLandingCompanyDetails from '../useLandingCompanyDetails'; // Import your hook
import { useQuery } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useQuery: jest.fn(() => {
        return {
            data: {
                landing_company_details: {
                    name: 'Company Name',
                    country: 'Ghana',
                },
            },
        };
    }),
}));

const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

describe('useLandingCompanyDetails', () => {
    it('should return landing company details', () => {
        const payload = {
            landing_company_details: 'svg',
        } as const;

        const { result } = renderHook(() => useLandingCompanyDetails(payload));
        const { data } = result.current;

        // Add assertions based on your specific payload and expected response
        expect(data?.name).toBe('Company Name');
        expect(data?.country).toBe('Ghana');
        expect(data?.tin_not_mandatory).toBeUndefined();
    });

    it('should correctly handle the tin_not_mandatory property', () => {
        const payload = {
            landing_company_details: 'bvi',
            country: 'id',
        } as const;

        // @ts-expect-error need to come up with a way to mock the return type of useQuery
        mockedUseQuery.mockImplementation(() => {
            return {
                data: {
                    landing_company_details: {
                        name: 'Company Name',
                        country: 'Ghana',
                        tin_not_mandatory: 0,
                    },
                },
            };
        });

        const { result } = renderHook(() => useLandingCompanyDetails(payload));
        const { data } = result.current;

        expect(data?.name).toBe('Company Name');
        expect(data?.country).toBe('Ghana');
        expect(data?.tin_not_mandatory).toBeDefined();
        expect(data?.tin_not_mandatory).toBe(0);
    });
});
