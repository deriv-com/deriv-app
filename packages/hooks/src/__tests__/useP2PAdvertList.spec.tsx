import React from 'react';
import { APIProvider, useInfiniteQuery } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useP2PAdvertList from '../useP2PAdvertList';

type TWrapper = {
    children: JSX.Element;
};

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useInfiniteQuery: jest.fn(),
}));

const mockUseInfiniteQuery = useInfiniteQuery as jest.MockedFunction<typeof useInfiniteQuery<'p2p_advert_list'>>;

describe('useP2PAdvertList', () => {
    it('should return undefined if there is no response', () => {
        const mock_store = mockStore({});
        // @ts-expect-error need to come up with a way to mock the return type of useInfiniteQuery
        mockUseInfiniteQuery.mockReturnValueOnce({});

        const wrapper = ({ children }: TWrapper) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useP2PAdvertList(), { wrapper });
        expect(result.current.data).toBeUndefined();
    });

    it('should return the p2p_advert_list object from response', () => {
        const mock_store = mockStore({
            client: { currency: 'USD' },
        });
        mockUseInfiniteQuery.mockReturnValueOnce({
            // @ts-expect-error need to come up with a way to mock the return type of useInfiniteQuery
            data: {
                pages: [
                    {
                        p2p_advert_list: {
                            list: [
                                {
                                    account_currency: 'USD',
                                    active_orders: 1,
                                    advertiser_details: {
                                        completed_orders_count: 0,
                                        id: '43',
                                        is_online: 1,
                                        last_online_time: 1698040768,
                                        name: 'client CR90000291',
                                        rating_average: null,
                                        rating_count: 0,
                                        recommended_average: null,
                                        recommended_count: null,
                                        total_completion_rate: null,
                                        loginid: 'CR90000291',
                                    },
                                    amount: 50,
                                    amount_display: '50.00',
                                    block_trade: 0,
                                    contact_info: 'Created by script. Please call me 02203400',
                                    counterparty_type: 'buy',
                                    country: 'id',
                                    created_time: 1698034883,
                                    description: 'Created by script. Please call me 02203400',
                                    effective_rate: 13500,
                                    effective_rate_display: '13500.00',
                                    id: '96',
                                    is_active: 1,
                                    is_visible: 1,
                                    local_currency: 'IDR',
                                    max_order_amount: 50,
                                    max_order_amount_display: '50.00',
                                    max_order_amount_limit: 49.9,
                                    max_order_amount_limit_display: '49.90',
                                    min_order_amount: 0.1,
                                    min_order_amount_display: '0.10',
                                    min_order_amount_limit: 0.1,
                                    min_order_amount_limit_display: '0.10',
                                    payment_info: 'Transfer to account 000-1111',
                                    payment_method: 'bank_transfer',
                                    price: 13500,
                                    price_display: '13500.00',
                                    rate: 13500,
                                    rate_display: '13500.00',
                                    rate_type: 'fixed',
                                    remaining_amount: 49.9,
                                    remaining_amount_display: '49.90',
                                    type: 'sell',
                                    order_expiry_period: 3600,
                                },
                            ],
                        },
                    },
                ],
            },
        });

        const wrapper = ({ children }: TWrapper) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useP2PAdvertList(), { wrapper });
        const adverts_list = result.current.data;
        expect(adverts_list).toHaveLength(1);
        expect(adverts_list?.[0].country).toBe('id');
        expect(adverts_list?.[0].amount).toBe(50);
        expect(adverts_list?.[0].contact_info).toBe('Created by script. Please call me 02203400');
    });
});
