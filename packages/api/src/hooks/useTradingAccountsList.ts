import { useMemo } from 'react';
import useAccountsList from './useAccountsList';

/** A custom hook that gets the list of all trading accounts for the current user. */
const useTradingAccountsList = () => {
    const { data: account_list_data, ...rest } = useAccountsList();

    // Filter out non-trading accounts.
    const filtered_accounts = useMemo(
        () => account_list_data?.filter(account => account.is_trading),
        [account_list_data]
    );

    // Add additional information to each trading account.
    const modified_accounts = useMemo(() => {
        return filtered_accounts?.map(trading => ({ ...trading }));
    }, [filtered_accounts]);

    return {
        /** The list of trading accounts for the current user. */
        data: modified_accounts,
        ...rest,
    };
};

export default useTradingAccountsList;
