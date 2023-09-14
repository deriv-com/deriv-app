import { useMemo } from 'react';
import useFetch from '../useFetch';

/** @description This hook is used to get all the available MT5 accounts. */
const useTradingPlatformAvailableAccounts = () => {
    const { data: mt5_available_accounts, ...rest } = useFetch('trading_platform_available_accounts', {
        payload: { platform: 'mt5' },
    });

    const modified_mt5_available_accounts = useMemo(
        () =>
            mt5_available_accounts?.trading_platform_available_accounts?.map(account => {
                return {
                    ...account,
                };
            }),
        [mt5_available_accounts?.trading_platform_available_accounts]
    );

    /** This function is used to group the available MT5 accounts by market type. */
    const grouped_mt5_available_accounts = useMemo(() => {
        return modified_mt5_available_accounts?.reduce((acc, account) => {
            const { market_type } = account;
            const marketType = market_type as keyof typeof acc;
            const marketTypeArray = acc[marketType] || (acc[marketType] = []);
            marketTypeArray.push(account);
            return acc;
        }, {} as Record<string, typeof modified_mt5_available_accounts>);
    }, [modified_mt5_available_accounts]);

    return {
        /** The available MT5 accounts grouped by market type */
        data: grouped_mt5_available_accounts,
        ...rest,
    };
};

export default useTradingPlatformAvailableAccounts;
