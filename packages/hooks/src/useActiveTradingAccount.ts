import { useMemo } from 'react';
import useTradingAccountsList from './useTradingAccountsList';

/** A custom hook that returns the object for the current active trading account. */
const useActiveTradingAccount = () => {
    const { data } = useTradingAccountsList();
    const active_trading_account = useMemo(() => data?.find(account => account.is_active), [data]);

    /** User's current active trading account. */
    return active_trading_account;
};

export default useActiveTradingAccount;
