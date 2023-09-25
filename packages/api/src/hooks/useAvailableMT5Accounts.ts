import { useMemo } from 'react';
import useQuery from '../useQuery';

const market_type_to_leverage_mapper: Record<string, number> = {
    gaming: 500,
    financial: 1000,
    all: 100,
};

/** @description This hook is used to get all the available MT5 accounts. */
const useAvailableMT5Accounts = () => {
    const { data: mt5_available_accounts, ...rest } = useQuery('trading_platform_available_accounts', {
        payload: { platform: 'mt5' },
    });

    const modified_mt5_available_accounts = useMemo(
        () =>
            mt5_available_accounts?.trading_platform_available_accounts?.map(account => {
                return {
                    ...account,
                    market_type: account.market_type === 'gaming' ? 'synthetic' : account.market_type,
                    platform: 'mt5',
                    leverage:
                        market_type_to_leverage_mapper[
                            account.market_type as keyof typeof market_type_to_leverage_mapper
                        ],
                } as const;
            }),
        [mt5_available_accounts?.trading_platform_available_accounts]
    );

    return {
        /** The available MT5 accounts */
        data: modified_mt5_available_accounts,
        ...rest,
    };
};

export default useAvailableMT5Accounts;
