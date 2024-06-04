import { useMemo } from 'react';

import useCtraderAccountsList from './useCtraderAccountsList';
import useDxtradeAccountsList from './useDxtradeAccountsList';
import useMT5AccountsList from './useMT5AccountsList';

/** A custom hook that gets the list all created CFD accounts of the user. */
const useCFDAccountsList = () => {
    const {
        data: mt5_accounts,
        isError: isMT5AccountsListError,
        isLoading: isMT5AccountsListLoading,
        isSuccess: isMT5AccountsListSuccess,
    } = useMT5AccountsList();
    const {
        data: dxtrade_accounts,
        isError: isDxtradeAccountsListError,
        isLoading: isDxtradeAccountsListLoading,
        isSuccess: isDxtradeAccountsListSuccess,
    } = useDxtradeAccountsList();
    const {
        data: ctrader_accounts,
        isError: isCtraderAccountsListError,
        isLoading: CtraderAccountsListLoading,
        isSuccess: isCtraderAccountsListSuccess,
    } = useCtraderAccountsList();

    const data = useMemo(() => {
        if (!mt5_accounts || !dxtrade_accounts || !ctrader_accounts) return;

        return {
            mt5: mt5_accounts,
            dxtrade: dxtrade_accounts,
            ctrader: ctrader_accounts,
        };
    }, [mt5_accounts, dxtrade_accounts, ctrader_accounts]);

    const isError = isMT5AccountsListError || isDxtradeAccountsListError || isCtraderAccountsListError;

    const isLoading = isMT5AccountsListLoading || isDxtradeAccountsListLoading || CtraderAccountsListLoading;

    const isSuccess = isMT5AccountsListSuccess && isDxtradeAccountsListSuccess && isCtraderAccountsListSuccess;

    return {
        data,
        isError,
        isLoading,
        isSuccess,
    };
};

export default useCFDAccountsList;
