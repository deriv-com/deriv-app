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
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    refetch: () => void;
    isFetching: boolean;
    error: unknown;
};

type LoginToken = {
    loginId: string;
    token: string;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: React.ReactNode;
    cookieTimeout?: number;
    loginIDKey?: string;
};

function waitForLoginAndTokenWithTimeout(loginIDKey?: string, cookieTimeout = 10000) {
    // Default timeout of 10 seconds
    let timeoutHandle: NodeJS.Timeout | undefined,
        cookieTimeoutHandle: NodeJS.Timeout | undefined, // Handle for the cookieTimeout
        rejectFunction: (reason?: string) => void; // To be used for rejecting the promise in case of a timeout or cookieTimeout expiry

    const checkLogin = (
        resolve: (value: { loginId: string; token: string }) => void,
        reject: (reason?: string) => void
    ) => {
        const loginId = getActiveLoginIDFromLocalStorage(loginIDKey);
        const token = getToken(loginId as string);
        if (loginId && token) {
            clearTimeout(timeoutHandle); // Clear the checkLogin timeout as we've succeeded
            clearTimeout(cookieTimeoutHandle); // Clear the cookieTimeout as well
            resolve({ loginId, token });
        } else {
            timeoutHandle = setTimeout(checkLogin, 100, resolve, reject);
        }
    };

    // Function to clear the timeouts and reject the promise if called
    const cleanup = () => {
        clearTimeout(timeoutHandle);
        clearTimeout(cookieTimeoutHandle);
        rejectFunction('Operation cancelled');
    };

    const promise = new Promise<LoginToken>((resolve, reject) => {
        rejectFunction = reject; // Assign reject function to be accessible outside promise scope for cleanup

        // Set up the cookieTimeout to reject the promise if not resolved in time
        cookieTimeoutHandle = setTimeout(() => {
            cleanup(); // Cleanup and reject the promise
            reject(new Error('Waiting for login or token timed out'));
        }, cookieTimeout);

        checkLogin(resolve, reject);
    });

    return {
        promise,
        cleanup,
    };
}

const AuthProvider = ({ loginIDKey, children, cookieTimeout }: AuthProviderProps) => {
    const [loginid, setLoginid] = useState<string | null>(null);

    const { mutateAsync } = useMutation('authorize');

    const { queryClient } = useAPIContext();

    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [data, setData] = useState<TSocketResponseData<'authorize'> | null>();

    useEffect(() => {
        if (!data) return;

        const accountList = data.authorize?.account_list;
        if (!accountList) return;

        const activeLoginID = getActiveLoginIDFromLocalStorage(loginIDKey) ?? accountList[0].loginid;
        if (!activeLoginID) return;

        const linkedDtradeAccount = accountList
            ?.find(account => account.loginid === activeLoginID)
            ?.linked_to?.find(linkedAccount => linkedAccount.platform === 'dtrade');

        setIsLoading(false);

        // set loginId for the current app
        localStorage.setItem(loginIDKey ?? 'active_loginid', activeLoginID);
        // set loginId for the default app
        if (linkedDtradeAccount?.loginid) localStorage.setItem('active_loginid', linkedDtradeAccount.loginid);
    }, [data, loginIDKey]);

    useEffect(() => {
        setIsLoading(true);
        setIsSuccess(false);

        const { promise, cleanup } = waitForLoginAndTokenWithTimeout(loginIDKey, cookieTimeout);

        promise
            .then(async ({ token }) => {
                setIsLoading(true);
                setIsFetching(true);
                await mutateAsync({ payload: { authorize: token || '' } })
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
            })
            .catch(() => {
                setIsLoading(false);
                setIsError(true);
            });

        return cleanup;
    }, [cookieTimeout, loginIDKey, mutateAsync]);

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
        [loginIDKey, loginid, mutateAsync, queryClient]
    );

    const refetch = useCallback(() => {
        switchAccount(loginid as string);
    }, [loginid, switchAccount]);

    const value = useMemo(() => {
        return {
            data,
            switchAccount,
            refetch,
            isLoading,
            isError,
            isFetching,
            isSuccess: isSuccess && !isLoading,
            error: isError,
        };
    }, [data, switchAccount, refetch, isLoading, isError, isFetching, isSuccess]);

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
