import React from 'react';
import { APIProvider, usePaginatedFetch } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useP2POrderList from '../useP2POrderList';

type TWrapper = {
    children: JSX.Element;
};

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    usePaginatedFetch: jest.fn(),
}));

const mockUsePaginatedFetch = usePaginatedFetch as jest.MockedFunction<typeof usePaginatedFetch<'p2p_order_list'>>;

describe('useP2POrdertList', () => {
    it('should return undefined if there is no response', () => {
        const mock_store = mockStore({});
        // @ts-expect-error need to come up with a way to mock the return type of usePaginatedFetch
        mockUsePaginatedFetch.mockReturnValue({});

        const wrapper = ({ children }: TWrapper) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useP2POrderList({}), { wrapper });
        expect(result.current.data).toBe(undefined);
    });
    it('should return the p2p_advert_list object from response', () => {
        const mock_store = mockStore({
            client: { currency: 'USD' },
        });

        mockUsePaginatedFetch.mockReturnValue({
            data: {
                p2p_order_list: {
                    list: [
                        // @ts-expect-error need to come up with a way to mock the return type of usePaginatedFetch
                        {
                            id: 1,
                            account_currency: 'USD',
                            amount: 0.1,
                            amount_display: '0.10',
                            status: 'pending',
                            contact_info: 'Created by script. Please call me 02203400',
                        },
                        {
                            id: 2,
                            account_currency: 'USD',
                            amount: 0.7,
                            amount_display: '0.70',
                            status: 'completed',
                            contact_info: 'Created by script. Please call me 02203400',
                        },
                    ],
                },
            },
        });

        const wrapper = ({ children }: TWrapper) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useP2POrderList({}), { wrapper });
        const p2p_order_list = result.current.data;

        expect(p2p_order_list).toHaveLength(2);
        expect(p2p_order_list?.[0].contact_info).toBe('Created by script. Please call me 02203400');
        expect(p2p_order_list?.[0].amount).toBe(0.1);
        expect(p2p_order_list?.[0].status).toBe('pending');
    });
});
