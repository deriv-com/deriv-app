import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { TSocketResponse } from '../../types';
import APIProvider from '../APIProvider';
import usePaginatedFetch from '../usePaginatedFetch';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    useWS: () => ({
        send: jest.fn(() =>
            Promise.resolve<TSocketResponse<'p2p_advert_list'>>({
                p2p_advert_list: {
                    list: [
                        // @ts-expect-error need to come up with a way to mock the return type of useFetch
                        {
                            account_currency: 'USD',
                            amount: 50,
                            amount_display: '50.00',
                        },
                    ],
                },
                echo_req: {},
                msg_type: 'p2p_advert_list',
                req_id: 1,
            })
        ),
    }),
}));

describe('usePaginatedFetch', () => {
    it('should call p2p_advert_list and get data in response', async () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result, waitFor } = renderHook(() => usePaginatedFetch('p2p_advert_list'), { wrapper });

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        const adverts_list = result.current.data?.p2p_advert_list?.list;

        expect(adverts_list).toHaveLength(1);
        expect(adverts_list?.[0].amount).toBe(50);
        expect(adverts_list?.[0].account_currency).toBe('USD');
        expect(adverts_list?.[0].amount_display).toBe('50.00');
    });
});
