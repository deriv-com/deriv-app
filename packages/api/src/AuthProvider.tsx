import React, { createContext, useState, useContext, useCallback, useEffect, useMemo } from 'react';
import { useAPIContext } from './APIProvider';

import { getActiveLoginIDFromLocalStorage, getToken } from '@deriv/utils';
import useMutation from './useMutation';
import { TSocketResponseData } from '../types';
import { log } from 'console';

// Define the type for the context state
type AuthContextType = {
    data: TSocketResponseData<'authorize'> | null | undefined;
    switchAccount: (loginid: string) => void;
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
};

async function waitForLogin(): Promise<string> {
    const checkLogin = (resolve: (value: string) => void, reject: (reason?: any) => void) => {
        const loginId = getActiveLoginIDFromLocalStorage();
        if (loginId) {
            resolve(loginId as unknown as string);
        } else {
            setTimeout(checkLogin, 100, resolve, reject);
        }
    };

    return new Promise<string>(checkLogin);
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [loginid, setLoginid] = useState<string | null>(null);

    const { mutateAsync } = useMutation('authorize');

    const { queryClient } = useAPIContext();

    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState<TSocketResponseData<'authorize'> | null>();

    useEffect(() => {
        setIsLoading(true);
        setIsSuccess(false);

        waitForLogin().then(storedLoginId => {
            const token = getToken(storedLoginId);
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
        (newLoginid: string) => {
            queryClient.cancelQueries();

            // it shouldn't happen, but if it happens, at least do not break application, just log it
            if (newLoginid === loginid) {
                // eslint-disable-next-line no-console
                console.error('switchAccount: same loginid');
                return;
            }

            setIsLoading(true);
            mutateAsync({ payload: { authorize: getToken(newLoginid) || '' } }).then(res => {
                setLoginid(newLoginid);
                setData(res);
                setIsLoading(false);

                localStorage.setItem('active_loginid', newLoginid);
            });
        },
        [loginid]
    );

    const refetch = useCallback(() => {
        switchAccount(loginid as string);
    }, [loginid]);

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
