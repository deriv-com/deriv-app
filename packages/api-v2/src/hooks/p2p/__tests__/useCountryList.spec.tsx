import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import APIProvider from '../../../APIProvider';
import AuthProvider from '../../../AuthProvider';
import useQuery from '../../../useQuery';
import useCountryList from '../entity/country/p2p-country-list/useCountryList';

jest.mock('../../../useQuery', () => jest.fn());

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);
jest.mock('../../useAuthorize', () => jest.fn(() => ({ isSuccess: true })));

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery<'p2p_country_list'>>;

describe('useCountryList', () => {
    it('should return undefined when there is no data', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useQuery
        mockUseQuery.mockReturnValue({ data: {} });
        const { result } = renderHook(() => useCountryList(), { wrapper });
        expect(result.current.data).toBeUndefined();
    });

    it('should return country list with the correct details', () => {
        const mockQueryData = {
            p2p_country_list: {
                ai: {
                    country_name: 'Anguilla',
                    cross_border_ads_enabled: 1,
                    fixed_rate_adverts: 'enabled',
                    float_rate_adverts: 'disabled',
                    float_rate_offset_limit: 10,
                    local_currency: 'XCD',
                    payment_methods: {
                        alipay: {
                            display_name: 'Alipay',
                            fields: {
                                account: {
                                    display_name: 'Alipay ID',
                                    required: 1,
                                    type: 'text',
                                },
                                instructions: {
                                    display_name: 'Instructions',
                                    required: 0,
                                    type: 'memo',
                                },
                            },
                            type: 'ewallet',
                        },
                    },
                },
            },
        };
        // @ts-expect-error need to come up with a way to mock the return type of useQuery
        mockUseQuery.mockReturnValue({
            data: mockQueryData,
        });

        const { result } = renderHook(() => useCountryList(), { wrapper });
        const p2p_country_list = result.current.data;
        expect(p2p_country_list).toEqual(mockQueryData.p2p_country_list);
    });
    it('should call the useQuery with parameters if passed', () => {
        renderHook(() => useCountryList({ country: 'id' }), { wrapper });
        expect(mockUseQuery).toHaveBeenCalledWith('p2p_country_list', {
            payload: { country: 'id' },
            options: { enabled: true, refetchOnWindowFocus: false },
        });
    });
    it('should call the useQuery with default parameters if not passed', () => {
        renderHook(() => useCountryList(), { wrapper });
        expect(mockUseQuery).toHaveBeenCalledWith('p2p_country_list', {
            payload: undefined,
            options: { enabled: true, refetchOnWindowFocus: false },
        });
    });
});
