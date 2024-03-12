import { useCallback, useEffect } from 'react';
import { useAuthorize, useCreateNewRealAccount } from '@deriv/api-v2';
import useSyncLocalStorageClientAccounts from './useSyncLocalStorageClientAccounts';

/**
 * @name useAddNewCurrencyAccount
 * @description A custom hook that creates a new currency account.
 * @returns {Object} Submit handler function, the new real CR account data and the status of the request.
 */
const useAddNewCurrencyAccount = () => {
    const {
        data: newTradingAccountData,
        mutate: createAccount,
        mutateAsync: createAccountAsync,
        status,
        ...rest
    } = useCreateNewRealAccount();

    const { addTradingAccountToLocalStorage } = useSyncLocalStorageClientAccounts();
    const { switchAccount } = useAuthorize();

    useEffect(() => {
        if (status === 'success') {
            // fail-safe for typescript as the data type is also undefined
            if (!newTradingAccountData) return;

            addTradingAccountToLocalStorage(newTradingAccountData);
            switchAccount(newTradingAccountData?.client_id);
        }
    }, [addTradingAccountToLocalStorage, newTradingAccountData, status, switchAccount]);

    /**
     * A function that handles the form submission and calls the mutation.
     */
    const mutate = useCallback(
        (currency: string) => {
            createAccount({
                payload: {
                    currency,
                },
            });
        },
        [createAccount]
    );

    /**
     *  Async function that handles the form submission and calls the mutation.
     */
    const mutateAsync = useCallback(
        (currency: string) =>
            createAccountAsync({
                payload: {
                    currency,
                },
            }),
        [createAccountAsync]
    );

    return {
        mutate,
        mutateAsync,
        data: newTradingAccountData,
        status,
        ...rest,
    };
};

export default useAddNewCurrencyAccount;
