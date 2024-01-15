import { renderHook } from '@testing-library/react-hooks';
import useAdvertiserAdverts from '../entity/advert/p2p-advertiser-adverts/useAdvertiserAdverts';
import useInfiniteQuery from '../../../useInfiniteQuery';
import APIProvider from '../../../APIProvider';
import React from 'react';

jest.mock('../../../useInfiniteQuery', () => jest.fn());

const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

const mockUseInfiniteQuery = useInfiniteQuery as jest.MockedFunction<typeof useInfiniteQuery<'p2p_advertiser_adverts'>>;

describe('useAdvertiserAdverts', () => {
    it('should return undefined when there is no data', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useInfiinteQuery
        (useInfiniteQuery as jest.MockedFunction<typeof useInfiniteQuery>).mockReturnValue({ data: {} });
        const { result } = renderHook(() => useAdvertiserAdverts(), { wrapper });
        expect(result.current.data).toBeUndefined();
    });

    it('should return adverts list with the correct details', () => {
        mockUseInfiniteQuery.mockReturnValue({
            data: {
                pages: [
                    {
                        p2p_advertiser_adverts: {
                            list: {
                                // @ts-expect-error need to come up with a way to mock the return type of useQuery
                                advertiser_details: {
                                    completed_orders_count: 0,
                                    id: '1',
                                    is_online: 1,
                                    is_recommended: null,
                                    last_online_time: 111,
                                    loginid: '111',
                                    name: 'test',
                                    rating_average: 0,
                                    rating_count: 0,
                                    recommended_average: 0,
                                    recommended_count: 0,
                                    total_completion_rate: 0,
                                },
                                amount: 50,
                                id: '101',
                                price: 13500,
                                type: 'buy',
                                rate_type: 'float',
                            },
                        },
                    },
                ],
            },
        });

        const { result } = renderHook(() => useAdvertiserAdverts(), { wrapper });
        const advertiser_adverts = result.current.data;

        expect(advertiser_adverts).toHaveLength(1);
        expect(advertiser_adverts?.[0].advertiser_details?.completed_orders_count).toBe(0);
        expect(advertiser_adverts?.[0].advertiser_details?.id).toBe('1');
        expect(advertiser_adverts?.[0].amount).toBe(50);
        expect(advertiser_adverts?.[0].id).toBe('101');
        expect(advertiser_adverts?.[0].price).toBe(13500);
        expect(advertiser_adverts?.[0].type).toBe('buy');
        expect(advertiser_adverts?.[0].rate_type).toBe('float');
        expect(advertiser_adverts?.[0].is_floating).toBe(true);
        expect(advertiser_adverts?.[0].advertiser_details?.is_online).toBe(true);
        expect(advertiser_adverts?.[0].advertiser_details?.last_online_time).toBe(111);
        expect(advertiser_adverts?.[0].advertiser_details?.loginid).toBe('111');
        expect(advertiser_adverts?.[0].advertiser_details?.name).toBe('test');
        expect(advertiser_adverts?.[0].advertiser_details?.rating_average).toBe(0);
        expect(advertiser_adverts?.[0].advertiser_details?.rating_count).toBe(0);
        expect(advertiser_adverts?.[0].advertiser_details?.recommended_average).toBe(0);
        expect(advertiser_adverts?.[0].advertiser_details?.recommended_count).toBe(0);
        expect(advertiser_adverts?.[0].advertiser_details?.total_completion_rate).toBe(0);
        expect(advertiser_adverts?.[0].advertiser_details?.is_recommended).toBe(false);
        expect(advertiser_adverts?.[0].advertiser_details?.has_not_been_recommended).toBe(true);
    });

    it('should call fetchNextPage when loadMoreAdverts is called', () => {
        mockUseInfiniteQuery.mockReturnValue({
            data: {
                pages: [
                    {
                        p2p_advertiser_adverts: {
                            list: {
                                // @ts-expect-error need to come up with a way to mock the return type of useQuery
                                advertiser_details: {
                                    completed_orders_count: 0,
                                    id: '1',
                                    is_online: 1,
                                    is_recommended: null,
                                    last_online_time: 111,
                                    loginid: '111',
                                    name: 'test',
                                    rating_average: 0,
                                    rating_count: 0,
                                    recommended_average: 0,
                                    recommended_count: 0,
                                    total_completion_rate: 0,
                                },
                                amount: 50,
                                id: '101',
                                price: 13500,
                                type: 'buy',
                                rate_type: 'float',
                            },
                        },
                    },
                ],
            },
            fetchNextPage: jest.fn(),
        });

        const { result } = renderHook(() => useAdvertiserAdverts(), { wrapper });
        result.current.loadMoreAdverts();

        expect(mockUseInfiniteQuery('p2p_advertiser_adverts').fetchNextPage).toBeCalled();
    });
});
