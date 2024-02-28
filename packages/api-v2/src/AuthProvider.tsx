import React, { createContext, useState, useContext, useCallback, useEffect, useMemo } from 'react';
import { useAPIContext } from './APIProvider';

import { getActiveLoginIDFromLocalStorage, getToken } from '@deriv/utils';
import useMutation from './useMutation';
import { TSocketResponseData } from '../types';

// Define the type for the context state
type AuthContextType = {
    loginIDKey?: string;
    data: TSocketResponseData<'authorize'> | null | undefined;
    switchAccount: (loginid: string) => void;
    switchEnvironment: (loginid: string | null | undefined) => void;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    refetch: () => void;
    isFetching: boolean;
    error: unknown;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: React.ReactNode;
    loginIDKey?: string;
};

async function waitForLoginAndToken(loginIDKey?: string): Promise<any> {
    const checkLogin = (resolve: (value: any) => void, reject: (reason?: any) => void) => {
        const loginId = getActiveLoginIDFromLocalStorage(loginIDKey);
        const token = getToken(loginId as string);
        if (loginId && token) {
            resolve({
                loginId,
                token,
            });
        } else {
            setTimeout(checkLogin, 100, resolve, reject);
        }
    };

    return new Promise<any>(checkLogin);
}

/**
 * Determines the WS environment based on the login ID and custom server URL.
 * @param {string | null | undefined} loginid - The login ID (can be a string, null, or undefined).
 * @returns {string} Returns the WS environment: 'custom', 'real', or 'demo'.
 */
const getEnvironment = (loginid: string | null | undefined) => {
    const customServerURL = window.localStorage.getItem('config.server_url');
    if (customServerURL) return 'custom';

    if (loginid && !/^(VRT|VRW)/.test(loginid)) return 'real';
    return 'demo';
};

const AuthProvider = ({ loginIDKey, children }: AuthProviderProps) => {
    const [loginid, setLoginid] = useState<string | null>(null);

    const { mutateAsync } = useMutation('authorize');

    const { setReconnect, standalone, queryClient } = useAPIContext();

    const activeLoginId = localStorage.getItem(loginIDKey ?? 'active_loginid') ?? undefined;
    const [environment, setEnvironment] = useState(getEnvironment(activeLoginId));

    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState<TSocketResponseData<'authorize'> | null>();

    useEffect(() => {
        setIsLoading(true);
        setIsSuccess(false);

        waitForLoginAndToken(loginIDKey).then(({ token }) => {
            setIsLoading(true);
            setIsFetching(true);
            mutateAsync({ payload: { authorize: token || '' } })
                .then(res => {
                    setData(res);
                    setIsLoading(false);
                    setIsSuccess(true);
                })
                .catch(() => {
                    setIsLoading(false);
                    setIsError(true);
                })
                .finally(() => {
                    setIsLoading(false);
                    setIsFetching(false);
                });
        });
    }, []);

    const switchAccount = useCallback(
        async (newLoginId: string) => {
            if (newLoginId === loginid) return;
            queryClient.cancelQueries();

            setIsLoading(true);

            const authorizeResponse = await mutateAsync({ payload: { authorize: getToken(newLoginId) ?? '' } });
            setLoginid(newLoginId);
            setData(authorizeResponse);

            const accountList = authorizeResponse.authorize?.account_list;
            const linkedDtradeAccount = accountList
                ?.find(account => account.loginid === newLoginId)
                ?.linked_to?.find(linkedAccount => linkedAccount.platform === 'dtrade');

            setIsLoading(false);

            // set loginId for the current app
            localStorage.setItem(loginIDKey ?? 'active_loginid', newLoginId);
            // set loginId for the default app
            if (linkedDtradeAccount?.loginid) localStorage.setItem('active_loginid', linkedDtradeAccount.loginid);
        },
        [loginid]
    );

    const switchEnvironment = useCallback(
        (loginid: string | null | undefined) => {
            if (!standalone) return;
            const currentEnvironment = getEnvironment(loginid);
            if (currentEnvironment !== 'custom' && currentEnvironment !== environment) {
                setEnvironment(currentEnvironment);
            }
        },
        [environment, standalone]
    );

    useEffect(() => {
        setReconnect(true);
    }, [environment, setReconnect]);

    const refetch = useCallback(() => {
        switchAccount(loginid as string);
    }, [loginid]);

    const value = useMemo(() => {
        return {
            data,
            switchAccount,
            switchEnvironment,
            refetch,
            isLoading,
            isError,
            isFetching,
            isSuccess: isSuccess && !isLoading,
            error: isError,
        };
    }, [data, switchAccount, switchEnvironment, refetch, isLoading, isError, isFetching, isSuccess]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within APIProvider');
    }
    return context;
};
