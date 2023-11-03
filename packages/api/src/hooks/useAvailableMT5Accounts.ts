import { useMemo } from 'react';
import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

const market_type_to_leverage_mapper: Record<string, number> = {
    gaming: 500,
    financial: 1000,
    all: 100,
};

/** A custom hook to get the list of available MT5 accounts. */
const useAvailableMT5Accounts = () => {
    const { isSuccess } = useAuthorize();
    const { data: mt5_available_accounts, ...rest } = useQuery('trading_platform_available_accounts', {
        payload: { platform: 'mt5' },
        options: { enabled: isSuccess },
    });

    const modified_mt5_available_accounts = useMemo(
        () =>
            mt5_available_accounts?.trading_platform_available_accounts?.map(account => {
                return {
                    ...account,
                    /** The market type for the account */
                    market_type: account.market_type === 'gaming' ? 'synthetic' : account.market_type,
                    /** The platform for the account */
                    platform: 'mt5',
                    /** Leverage for the account */
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
