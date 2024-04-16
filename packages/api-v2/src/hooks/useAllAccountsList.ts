import { useMemo } from 'react';
import useDerivAccountsList from './useDerivAccountsList';
import useCFDAccountsList from './useCFDAccountsList';

/** A custom hook to get all user accounts, including external apps accounts */
const useAllAccountsList = () => {
    const {
        data: accountsList,
        isError: isAccountsListError,
        isLoading: isAccountsListLoading,
    } = useDerivAccountsList();
    const {
        data: cfdsList,
        isError: isCFDAccountsListError,
        isLoading: isCFDAccountsListLoading,
    } = useCFDAccountsList();

    const accounts = useMemo(
        () => ({
            wallets: accountsList?.filter(account => account.is_wallet),
            dtrade: accountsList?.filter(account => account.is_trading),
            ...cfdsList,
        }),
        [accountsList, cfdsList]
    );
    const isError = isAccountsListError || isCFDAccountsListError;
    const isLoading = isAccountsListLoading || isCFDAccountsListLoading;

    return {
        data: accounts,
        isError,
        isLoading,
    };
};

export default useAllAccountsList;
