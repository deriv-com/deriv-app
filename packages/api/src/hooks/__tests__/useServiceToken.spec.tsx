import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import APIProvider from '../../APIProvider';
import useFetch from '../../useFetch';
import useServiceToken from '../useServiceToken';

jest.mock('../../useFetch', () => jest.fn());

type TServiceTokenPayload = Parameters<typeof useServiceToken>[0];
const mock_token = 'ABCDefgh1234567890';

describe('useServiceToken', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the service token', async () => {
        (useFetch as jest.Mock).mockReturnValueOnce({
            msg_type: 'service_token',
            service_token: {
                onfido: {
                    token: mock_token,
                },
            },
        });
        const payload: TServiceTokenPayload = {
            country: 'co',
            service: 'onfido',
        };
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        const { result, waitFor } = renderHook(() => useServiceToken(payload), { wrapper });

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        expect(result.current.service_token?.onfido?.token).toEqual(mock_token);
    });

    it('should return the error message', async () => {
        const error_message = {
            code: 'ApplicantError',
            message: 'Cannot create applicant',
        };
        (useFetch as jest.Mock).mockReturnValueOnce({
            error: error_message,
        });

        const payload: TServiceTokenPayload = {
            country: 'id',
            service: 'onfido',
        };

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result, waitFor } = renderHook(() => useServiceToken(payload), { wrapper });

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        expect(result.current.error).toMatchObject(error_message);
    });
});
