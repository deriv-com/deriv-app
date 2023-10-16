import { useMemo } from 'react';
import useTradingAccountsList from './useTradingAccountsList';

/** A custom hook that returns the trading object for the current active trading. */
const useActiveTradingAccount = () => {
    const { data, ...rest } = useTradingAccountsList();
    const active_trading = useMemo(() => data?.find(trading => trading.is_active), [data]);

    return {
        /** User's current active trading. */
        data: active_trading,
        ...rest,
    };
};

export default useActiveTradingAccount;
