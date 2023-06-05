import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { TSocketResponse } from '../../types';
import APIProvider from '../APIProvider';
import useFetch from '../useFetch';

jest.mock('@deriv/shared', () => ({
    WS: {
        send: jest.fn(() =>
            Promise.resolve<TSocketResponse<'ping'>>({
                msg_type: 'ping',
                ping: 'pong',
                echo_req: {},
            })
        ),
    },
}));

describe('useFetch', () => {
    test('should call ping and get pong in response', async () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result, waitFor } = renderHook(() => useFetch('ping'), { wrapper });

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        expect(result.current.data?.ping).toEqual('pong');
    });
});
