import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import useAuthorize from './useAuthorize';

/** A custom hook to get the list of trading accounts for the current user. */
const useTradingAccountsList = () => {
    const { data: authorize_data, ...rest } = useAuthorize();
    const { data: balance_data } = useFetch('balance', { payload: { account: 'all' } });

    // Filter trading accounts.
    const trading_accounts = useMemo(
        () => authorize_data?.account_list?.filter(account => account.account_category === 'trading'),
        [authorize_data?.account_list]
    );

    // Add balance to each account.
    const trading_accounts_with_balance = useMemo(
        () =>
            trading_accounts?.map(account => ({
                ...account,
                /** balance */
                balance: balance_data?.balance?.accounts?.[account.loginid || '']?.balance || 0,
            })),
        [balance_data?.balance?.accounts, trading_accounts]
    );

    return {
        /** List of wallets for current user. */
        data: trading_accounts_with_balance,
        ...rest,
    };
};

export default useTradingAccountsList;
