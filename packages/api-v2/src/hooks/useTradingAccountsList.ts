import { useMemo } from 'react';
import useDerivAccountsList from './useDerivAccountsList';
import useCurrencyConfig from './useCurrencyConfig';

/** A custom hook that gets the list of all trading accounts for the current user. */
const useTradingAccountsList = () => {
    const { data: account_list_data, ...rest } = useDerivAccountsList();
    const { getConfig } = useCurrencyConfig();

    // Filter out non-trading accounts.
    const filtered_accounts = useMemo(
        () => account_list_data?.filter(account => account.is_trading) ?? [],
        [account_list_data]
    );

    // Add additional information to each trading account.
    const modified_accounts = useMemo(() => {
        return filtered_accounts?.map(trading => ({
            ...trading,
            first_real_loginid: filtered_accounts?.find(account => account.account_type === 'real')?.loginid[0],
            demo_loginid: filtered_accounts?.find(account => account.account_type === 'demo')?.loginid,
        }));
    }, [filtered_accounts]);

    const fiat_account =
        modified_accounts?.find(account => getConfig(account.currency ?? '')?.is_fiat)?.currency ?? 'USD';

    return {
        /** The list of trading accounts for the current user. */
        data: modified_accounts,
        /** The currency of the fiat account. */
        fiat_account,
        ...rest,
    };
};

export default useTradingAccountsList;
