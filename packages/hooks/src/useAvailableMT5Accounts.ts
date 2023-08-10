import { useMemo } from 'react';
import { useFetch } from '@deriv/api';

const market_type_to_account_map = {
    gaming: {
        availability: 'Non-EU',
        icon: 'Derived',
        platform: 'mt5',
    },
    financial: {
        availability: 'All',
        icon: 'Financial',
        platform: 'mt5',
    },
    all: {
        availability: 'All',
        icon: 'SwapFree',
        platform: 'mt5',
    },
} as const;

/**
 *
 * @description This hook is used to get all the available MT5 accounts.
 */
const useAvailableMT5Accounts = () => {
    const { data: mt5_available_accounts, ...rest } = useFetch('trading_platform_available_accounts', {
        payload: { platform: 'mt5' },
    });

    const modified_mt5_available_accounts = useMemo(
        () =>
            mt5_available_accounts?.trading_platform_available_accounts?.map(account => {
                return {
                    ...account,
                    ...market_type_to_account_map[account.market_type as keyof typeof market_type_to_account_map],
                };
            }),
        [mt5_available_accounts?.trading_platform_available_accounts]
    );

    const grouped_mt5_available_accounts = useMemo(() => {
        return modified_mt5_available_accounts?.reduce((acc, account) => {
            const { market_type } = account;
            if (!acc[market_type as keyof typeof acc]) {
                acc[market_type || 'gaming'] = [];
            }
            acc[market_type || 'gaming'].push(account);
            return acc;
        }, {} as Record<string, typeof modified_mt5_available_accounts>);
    }, [modified_mt5_available_accounts]);

    return {
        ...rest,
        data: grouped_mt5_available_accounts,
    };
};

export default useAvailableMT5Accounts;
