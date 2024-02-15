import React, { createContext, useState, useContext, useCallback, useEffect, useMemo } from 'react';
import { useAPIContext } from './APIProvider';

import { getActiveLoginIDFromLocalStorage, getToken } from '@deriv/utils';
import useMutation from './useMutation';
import { TSocketResponseData } from '../types';

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

async function waitForLoginAndToken(): Promise<any> {
    const checkLogin = (resolve: (value: any) => void, reject: (reason?: any) => void) => {
        const loginId = getActiveLoginIDFromLocalStorage();
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

        waitForLoginAndToken().then(({ token }) => {
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
            if (newLoginid === loginid) {
                return;
            }

            queryClient.cancelQueries();

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
