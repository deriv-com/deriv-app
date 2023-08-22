import React from 'react';
import { APIProvider, usePaginatedFetch } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useP2PAdvertList from '../useP2PAdvertList';

type TWrapper = {
    children: JSX.Element;
};

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    usePaginatedFetch: jest.fn(),
}));

const mockUsePaginatedFetch = usePaginatedFetch as jest.MockedFunction<typeof usePaginatedFetch<'p2p_advert_list'>>;

describe('useP2PAdvertList', () => {
    it('should return undefined if there is no response', () => {
        const mock_store = mockStore({});
        // @ts-expect-error need to come up with a way to mock the return type of usePaginatedFetch
        mockUsePaginatedFetch.mockReturnValue({});

        const wrapper = ({ children }: TWrapper) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useP2PAdvertList(), { wrapper });
        expect(result.current.data).toBe(undefined);
    });

    it('should return the p2p_advert_list object from response', () => {
        const mock_store = mockStore({
            client: { currency: 'USD' },
        });

        mockUsePaginatedFetch.mockReturnValue({
            data: {
                p2p_advert_list: {
                    list: [
                        // @ts-expect-error need to come up with a way to mock the return type of usePaginatedFetch
                        {
                            account_currency: 'USD',
                            amount: 50,
                            amount_display: '50.00',
                            block_trade: 0,
                            contact_info: 'Created by script. Please call me 02203400',
                            counterparty_type: 'buy',
                            country: 'id',
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

        const { result } = renderHook(() => useP2PAdvertList(), { wrapper });
        const adverts_list = result.current.data;

        expect(adverts_list).toHaveLength(1);
        expect(adverts_list?.[0].country).toBe('id');
        expect(adverts_list?.[0].amount).toBe(50);
        expect(adverts_list?.[0].contact_info).toBe('Created by script. Please call me 02203400');
    });
});
