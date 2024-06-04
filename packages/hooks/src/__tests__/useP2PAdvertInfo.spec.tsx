import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { APIProvider, useSubscription } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import useP2PAdvertInfo from '../useP2PAdvertInfo';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useSubscription: jest.fn(),
}));

const mockUseSubscription = useSubscription as jest.MockedFunction<typeof useSubscription<'p2p_advert_info'>>;

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <StoreProvider store={mockStore({})}>{children}</StoreProvider>
    </APIProvider>
);

describe('useP2PAdvertInfo', () => {
    it('should return undefined if there is no response', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseSubscription.mockReturnValue({ data: {}, subscribe: jest.fn() });

        const { result } = renderHook(() => useP2PAdvertInfo('1'), { wrapper });

        expect(result.current.data).toBe(undefined);
    });

    it('should return advert info if id has been passed', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseSubscription.mockReturnValue({
            data: {
                p2p_advert_info: {
                    advertiser_details: {
                        completed_orders_count: 0,
                        id: '1',
                        is_online: 1,
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
                },
            },
            subscribe: jest.fn(),
        });

        const { result } = renderHook(() => useP2PAdvertInfo('1'), { wrapper });
        const advertiser_details = result.current.data?.advertiser_details;

        expect(advertiser_details?.completed_orders_count).toBe(0);
        expect(advertiser_details?.id).toBe('1');
        expect(advertiser_details?.is_online).toBe(1);
        expect(advertiser_details?.last_online_time).toBe(111);
        expect(advertiser_details?.loginid).toBe('111');
        expect(advertiser_details?.name).toBe('test');
        expect(advertiser_details?.rating_average).toBe(0);
        expect(advertiser_details?.rating_count).toBe(0);
        expect(advertiser_details?.recommended_average).toBe(0);
        expect(advertiser_details?.recommended_count).toBe(0);
        expect(advertiser_details?.total_completion_rate).toBe(0);
        expect(result.current.data?.amount).toBe(50);
        expect(result.current.data?.id).toBe('101');
        expect(result.current.data?.price).toBe(13500);
        expect(result.current.data?.is_buy).toBeTruthy;
        expect(result.current.data?.is_sell).toBeFalsy;
    });
});
