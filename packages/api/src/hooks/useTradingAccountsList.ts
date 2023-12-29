import { useMemo } from 'react';
import useDerivAccountsList from './useDerivAccountsList';

/** A custom hook that gets the list of all trading accounts for the current user. */
const useTradingAccountsList = () => {
    const { data: account_list_data, ...rest } = useDerivAccountsList();

    // Filter out non-trading accounts.
    const filtered_accounts = useMemo(
        () => account_list_data?.filter(account => account.is_trading),
        [account_list_data]
    );

    // Add additional information to each trading account.
    const modified_accounts = useMemo(() => {
        return filtered_accounts?.map(trading => ({
            ...trading,
            first_real_account: filtered_accounts?.find(account => account.account_type === 'real')?.loginid[0],
            demo_loginid: filtered_accounts?.find(account => account.account_type === 'demo')?.loginid,
        }));
    }, [filtered_accounts]);

    return {
        /** The list of trading accounts for the current user. */
        data: modified_accounts,
        ...rest,
    };
};

export default useTradingAccountsList;
