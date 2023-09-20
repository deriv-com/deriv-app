import { useMemo } from 'react';
import useFetch from '../useFetch';

/** @description This hook is used to get all the available MT5 accounts. */
const useAvailableMT5Accounts = () => {
    const { data: mt5_available_accounts, ...rest } = useFetch('trading_platform_available_accounts', {
        payload: { platform: 'mt5' },
    });

    const modified_mt5_available_accounts = useMemo(
        () =>
            mt5_available_accounts?.trading_platform_available_accounts?.map(account => {
                return {
                    ...account,
                    market_type: account.market_type === 'gaming' ? 'synthetic' : account.market_type,
                } as const;
            }),
        [mt5_available_accounts?.trading_platform_available_accounts]
    );

    return {
        /** The available MT5 accounts grouped by market type */
        data: modified_mt5_available_accounts,
        ...rest,
    };
};

export default useAvailableMT5Accounts;
