import { renderHook } from '@testing-library/react-hooks';
import useApiToken from '../useApiToken';
import APIProvider from '../../APIProvider';
import React from 'react';
import { WS } from '@deriv/shared';

jest.mock('@deriv/shared', () => ({
    WS: {
        send: jest.fn().mockResolvedValueOnce({
            msg_type: 'api_token',
            echo_req: {},
            api_token: {
                tokens: [
                    {
                        display_name: 'Created by script',
                        last_used: '',
                        scopes: ['read', 'trade', 'payments', 'admin'],
                        token: '',
                        valid_for_ip: '',
                    },
                    {
                        display_name: 'test12',
                        last_used: '',
                        scopes: ['read', 'payments'],
                        token: '',
                        valid_for_ip: '',
                    },
                ],
            },
        }),
    },
}));

describe('useApiToken', () => {
    it('should return the token data when a get call is made', async () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        const { result, waitForNextUpdate } = renderHook(() => useApiToken(), { wrapper });

        result.current.getApiToken();

        await waitForNextUpdate();

        expect(result.current.api_token_data?.tokens).toHaveLength(2);
    });

    it('should return error when error is thrown', async () => {
        const error_message = { message: 'Invalid API token' };
        WS.send.mockResolvedValueOnce({ error: error_message });
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        const { result, waitForNextUpdate } = renderHook(() => useApiToken(), { wrapper });

        result.current.getApiToken();

        await waitForNextUpdate();

        expect(result.current.error).toMatchObject(error_message);
    });
});
