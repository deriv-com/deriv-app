import { useMemo } from 'react';
import useAccountsList from './useAccountsList';

/** A custom hook that returns the account object for the current active account. */
const useActiveAccount = () => {
    const { data: account_list_data, ...rest } = useAccountsList();
    const active_account = useMemo(() => account_list_data?.find(account => account.is_active), [account_list_data]);

    return {
        /** User's current active account. */
        data: active_account,
        ...rest,
    };
};

export default useActiveAccount;
