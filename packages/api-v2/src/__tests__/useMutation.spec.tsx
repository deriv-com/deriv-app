import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { TSocketResponse } from '../../types';
import APIProvider from '../APIProvider';
import AuthProvider from '../AuthProvider';
import useMutation from '../useMutation';

jest.mock('../useAPI', () => () => ({
    send: async () => ({ verify_email: 1 } as TSocketResponse<'verify_email'>),
}));

describe('useMutation', () => {
    test('should call verify_email and get 1 in response', async () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );

        const { result, waitFor } = renderHook(() => useMutation('verify_email'), { wrapper });

        result.current.mutate({ payload: { verify_email: 'john@example.com', type: 'request_email' } });

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        expect(result.current.data?.verify_email).toEqual(1);
    });
});
