import { useMemo } from 'react';
import useDerivAccountsList from './useDerivAccountsList';
import useActiveWalletAccount from './useActiveWalletAccount';

/** A custom hook that gets the active linked trading account for the current user. */
const useActiveLinkedToTradingAccount = () => {
    const { data: account_list_data } = useDerivAccountsList();
    const { data: wallet_account_data } = useActiveWalletAccount();

    const modified_account = useMemo(() => {
        if (!account_list_data || !wallet_account_data) return undefined;

        const linkedDtradeLoginId = account_list_data
            ?.filter(account => account.loginid === wallet_account_data?.loginid)[0]
            ?.linked_to?.find(linked => linked.loginid && linked?.platform === 'dtrade')?.loginid;

        const matchingTradingAccount = account_list_data?.filter(account => account.loginid === linkedDtradeLoginId)[0];

        return { ...matchingTradingAccount };
    }, [account_list_data, wallet_account_data]);

    return {
        /** The active linked trading account for the current user. */
        data: modified_account,
    };
};

export default useActiveLinkedToTradingAccount;
