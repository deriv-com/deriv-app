import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { APIProvider, useFetch } from '@deriv/api'; // Replace with your mock for useFetch
import useAccountStatus from '../useAccountStatus';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'get_account_status'>>;

describe('useAccountStatus', () => {
    test('should return verified for identity status', () => {
        mockUseFetch.mockReturnValueOnce({
            data: {
                // @ts-expect-error need to come up with a way to mock the return type of useFetch
                get_account_status: { authentication: { identity: { status: 'verified' } } },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAccountStatus(), { wrapper });

        expect(result.current.data?.authentication?.identity?.status).toBe('verified');
    });

    test('should return verified for document status', () => {
        mockUseFetch.mockReturnValueOnce({
            data: {
                // @ts-expect-error need to come up with a way to mock the return type of useFetch
                get_account_status: { authentication: { document: { status: 'verified' } } },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAccountStatus(), { wrapper });

        expect(result.current.data?.authentication?.document?.status).toBe('verified');
    });

    test('should return none for P2P status', () => {
        mockUseFetch.mockReturnValueOnce({
            data: {
                // @ts-expect-error need to come up with a way to mock the return type of useFetch
                get_account_status: { p2p_status: 'none' },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useAccountStatus(), { wrapper });

        expect(result.current.data?.p2p_status).toBe('none');
    });
});
