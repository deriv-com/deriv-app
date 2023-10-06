import { useMemo } from 'react';
import useAccountsList from './useAccountsList';

/** A custom hook that returns the account object for the current active account. */
const useActiveAccount = () => {
    const { data: account_list_data } = useAccountsList();
    const active_account = useMemo(() => account_list_data?.find(account => account.is_active), [account_list_data]);

    /** User's current active account. */
    return active_account;
};

export default useActiveAccount;
