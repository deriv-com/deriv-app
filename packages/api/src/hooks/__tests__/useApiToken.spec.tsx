import React from 'react';
import { useWS } from '@deriv/shared';
import { renderHook } from '@testing-library/react-hooks';
import useApiToken from '../useApiToken';
import APIProvider from '../../APIProvider';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    useWS: jest.fn(),
}));
const mockUseWS = useWS as jest.MockedFunction<typeof useWS>;

describe('useApiToken', () => {
    it('should return the token data when a get call is made', async () => {
        mockUseWS.mockReturnValue({
            send: jest.fn(() =>
                Promise.resolve({
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
                })
            ),
        });
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        const { result, waitForNextUpdate } = renderHook(() => useApiToken(), { wrapper });

        result.current.getApiToken();

        await waitForNextUpdate();

        expect(result.current.api_token_data?.tokens).toHaveLength(2);
    });

    it('should return error when error is thrown', async () => {
        const error_message = { message: 'Invalid API token' };
        mockUseWS.mockReturnValue({
            send: jest.fn(() => Promise.resolve({ error: error_message })),
        });
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        const { result, waitForNextUpdate } = renderHook(() => useApiToken(), { wrapper });

        result.current.getApiToken();

        await waitForNextUpdate();

        expect(result.current.error).toMatchObject(error_message);
    });
});
