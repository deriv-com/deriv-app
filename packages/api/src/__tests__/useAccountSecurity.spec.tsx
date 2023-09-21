import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useGetSecretKey, useGetTwoFa, useSendUserOTP } from '../hooks/useAccountSecurity';
import APIProvider from '../APIProvider';
import { useAuthorize } from '../hooks';
import useRequest from '../useRequest';

jest.mock('../useRequest', () => jest.fn());

jest.mock('../hooks/useAuthorize', () => jest.fn());

const mockUseAuthorize = useAuthorize as jest.MockedFunction<typeof useAuthorize>;
const mockUseRequest = useRequest as jest.MockedFunction<typeof useRequest<'account_security'>>;

describe('useAccountSecurity', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockMutate = jest.fn();

    test('should call useGetTwoFa and get is_TwoFA_enabled in response', async () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseAuthorize.mockReturnValue({ isSuccess: true });
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValueOnce({
            data: {
                account_security: {
                    totp: {
                        is_enabled: 1,
                    },
                },
            },
            mutate: mockMutate,
            isSuccess: true,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result, waitFor } = renderHook(() => useGetTwoFa(), { wrapper });

        result.current.getTwoFA();

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        expect(result.current.is_TwoFA_enabled).toEqual(true);
    });

    test('should call useGetTwoFa and if authorization fails then mutate function should not be called', async () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseAuthorize.mockReturnValue({ isSuccess: false });
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValueOnce({
            data: {
                account_security: {
                    totp: {
                        is_enabled: 1,
                    },
                },
            },
            mutate: mockMutate,
            isSuccess: true,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result, waitFor } = renderHook(() => useGetTwoFa(), { wrapper });

        result.current.getTwoFA();

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        expect(mockMutate).not.toHaveBeenCalled();
    });

    test('should call useGetTwoFa and if authorization succeeds then mutate function should be called', async () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseAuthorize.mockReturnValue({ isSuccess: true });
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValueOnce({
            data: {
                account_security: {
                    totp: {
                        is_enabled: 1,
                    },
                },
            },
            mutate: mockMutate,
            isSuccess: true,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result, waitFor } = renderHook(() => useGetTwoFa(), { wrapper });

        result.current.getTwoFA();

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        expect(mockMutate).toHaveBeenCalled();
    });

    test('should call useGetSecretKey and get secret_key in response', async () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseAuthorize.mockReturnValue({ isSuccess: true });
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValueOnce({
            data: {
                account_security: {
                    totp: {
                        secret_key: 'secret_key_123',
                    },
                },
            },
            mutate: mockMutate,
            isSuccess: true,
        });
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result, waitFor } = renderHook(() => useGetSecretKey(), { wrapper });

        result.current.getSecretKey();

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        expect(result.current.data?.account_security?.totp?.secret_key).toEqual('secret_key_123');
    });

    test('should call useGetSecretKey and if authorization fails then mutate function should not be called', async () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseAuthorize.mockReturnValue({ isSuccess: false });
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValueOnce({
            data: {
                account_security: {
                    totp: {
                        secret_key: 'secret_key_123',
                    },
                },
            },
            mutate: mockMutate,
            isSuccess: true,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result, waitFor } = renderHook(() => useGetSecretKey(), { wrapper });

        result.current.getSecretKey();

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        expect(mockMutate).not.toHaveBeenCalled();
    });

    test('should call useGetSecretKey and if authorization succeeds then mutate function should be called', async () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseAuthorize.mockReturnValue({ isSuccess: false });
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValueOnce({
            data: {
                account_security: {
                    totp: {
                        secret_key: 'secret_key_123',
                    },
                },
            },
            mutate: mockMutate,
            isSuccess: true,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result, waitFor } = renderHook(() => useGetSecretKey(), { wrapper });

        result.current.getSecretKey();

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        expect(mockMutate).not.toHaveBeenCalled();
    });

    test('should call useSendUserOTP and get is_TwoFA_enabled in response', async () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseAuthorize.mockReturnValue({ isSuccess: true });
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValueOnce({
            data: { account_security: { totp: { is_enabled: 0 } } },
            mutate: mockMutate,
            isSuccess: true,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result, waitFor } = renderHook(() => useSendUserOTP(), { wrapper });

        result.current.sendUserOTP({ totp_action: 'disable', otp: '328746' });

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        expect(result.current.is_TwoFA_enabled).toEqual(false);
    });

    test('should call useSendUserOTP and if authorization succeeds then mutate function should be called', async () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseAuthorize.mockReturnValue({ isSuccess: true });
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValueOnce({
            data: { account_security: { totp: { is_enabled: 0 } } },
            mutate: mockMutate,
            isSuccess: true,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result, waitFor } = renderHook(() => useSendUserOTP(), { wrapper });

        result.current.sendUserOTP({ totp_action: 'disable', otp: '328746' });

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        expect(mockMutate).toHaveBeenCalled();
    });

    test('should call useSendUserOTP and if authorization fails then mutate function should not be called', async () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseAuthorize.mockReturnValue({ isSuccess: false });
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValueOnce({
            data: { account_security: { totp: { is_enabled: 0 } } },
            mutate: mockMutate,
            isSuccess: true,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result, waitFor } = renderHook(() => useSendUserOTP(), { wrapper });

        result.current.sendUserOTP({ totp_action: 'disable', otp: '328746' });

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        expect(mockMutate).not.toHaveBeenCalled();
    });
});
