import React from 'react';
import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import ApiTokenProvider from '../api-token.provider';
import useApiToken from '../hooks/use-api-token';
import makeMockSocket from '../__mocks__/socket.mock';
import { IFormValues, TToken } from 'Types';
import {
    mock_failed_get_tokens,
    mock_success_add_token,
    mock_success_delete_token,
    mock_success_get_tokens,
} from '../__mocks__/responses.mock';

const { wsConnect, wsClient, wsClean, wsServer } = makeMockSocket();

let context_tokens: TToken[] = [];
let error_message: string;
let loading = false;

const mockUpdateTokens = jest.fn().mockImplementation(updatedTokens => {
    context_tokens = [...updatedTokens];
    return context_tokens;
});

const mockUpdateErrorMessage = jest.fn().mockImplementation(message => {
    error_message = message;
    return error_message;
});

const mockToggleLoading = jest.fn().mockImplementation(() => {
    loading = !loading;
    return loading;
});

const mockUseContext = jest.fn().mockImplementation(() => ({
    api_tokens: [],
    error_message: undefined,
    loading,
    ws: wsClient,
    update_tokens: mockUpdateTokens,
    update_error_message: mockUpdateErrorMessage,
    toggle_loading: mockToggleLoading,
}));

React.useContext = mockUseContext;

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ApiTokenProvider ws={wsClient}>{children}</ApiTokenProvider>
);

describe('Api Token', () => {
    beforeEach(async () => {
        await wsConnect();
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });
    afterAll(() => {
        wsClean();
    });

    it('Should set the tokens value in context on getApiTokens call', async () => {
        const { result } = renderHook(() => useApiToken(), { wrapper });

        act(() => {
            result.current.getApiTokens();
        });
        wsServer.send(mock_success_get_tokens);

        await expect(wsServer).toReceiveMessage(mock_success_get_tokens.echo_req);

        expect(mockUpdateTokens).toHaveBeenCalledTimes(1);
        expect(context_tokens).toHaveLength(1);
        expect(context_tokens).toEqual([
            {
                display_name: 'Token example',
                last_used: '',
                scopes: ['admin', 'read', 'trade'],
                token: 'token_string_whatever',
                valid_for_ip: '',
            },
        ]);
    });

    it('Should set the error message on getApiTokens error', async () => {
        const { result } = renderHook(() => useApiToken(), { wrapper });

        act(() => {
            result.current.getApiTokens();
        });
        wsServer.send(mock_failed_get_tokens);
        await expect(wsServer).toReceiveMessage(mock_success_get_tokens.echo_req);
        expect(mockUpdateErrorMessage).toHaveBeenCalledTimes(1);
        expect(error_message).toBe('Input validation failed: api_token');
    });

    it('Should add new token', async () => {
        const mockOnFinished = jest.fn();

        const { result } = renderHook(() => useApiToken(), { wrapper });

        const formValues: IFormValues = {
            token_name: 'new_token',
            admin: false,
            payments: true,
            read: false,
            trade: false,
            trading_information: true,
        };

        act(() => {
            result.current.requestAddToken(formValues, mockOnFinished);
        });

        wsServer.send(mock_success_add_token);
        await expect(wsServer).toReceiveMessage(mock_success_add_token.echo_req);

        expect(mockOnFinished).toHaveBeenCalledTimes(1);
        expect(mockOnFinished).toHaveBeenCalledWith(mock_success_add_token);
        expect(mockUpdateTokens).toHaveBeenCalledTimes(1);
        expect(mockUpdateTokens).toHaveBeenCalledWith(mock_success_add_token.api_token.tokens);
    });

    it('Should delete token', async () => {
        const mockOnFinished = jest.fn();

        const { result } = renderHook(() => useApiToken(), { wrapper });

        act(() => {
            result.current.deleteApiToken('token_tobe_deleted_on_this_call', mockOnFinished);
        });
        wsServer.send(mock_success_delete_token);

        // either we have to await for the next message or have an assertion for the received message
        // await wsServer.nextMessage;

        await expect(wsServer).toReceiveMessage(mock_success_delete_token.echo_req);

        expect(mockUpdateTokens).toHaveBeenCalledTimes(1);

        expect(mockOnFinished).toHaveBeenCalledTimes(1);
    });
});
