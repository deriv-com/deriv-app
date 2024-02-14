import { useMemo } from 'react';
import { useAuthContext } from '../AuthProvider';

/** A custom hook that authorize the user with the given token. If no token is given,
 * it will use the current token from localStorage.
 */
const useAuthorize = () => {
    const ctx = useAuthContext();
    const { data, switchAccount, isLoading, isSuccess, isFetching, isError, refetch, error } = ctx;

    const modifiedData = useMemo(() => {
        return { ...data?.authorize };
    }, [data]);

    const value = useMemo(() => {
        return {
            /** The authorize response. */
            data: modifiedData,
            /** Function to switch to another account */
            switchAccount,
            isLoading,
            isSuccess,
            isFetching,
            isError,
            refetch,
            error,
        };
    }, [modifiedData, switchAccount, isLoading, isSuccess, isFetching, isError, refetch, error]);

    return value;
};

export default useAuthorize;
