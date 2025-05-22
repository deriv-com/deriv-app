import { useMemo } from 'react';

import useActiveAccount from './useActiveAccount';
import useAvailableMT5Accounts from './useAvailableMT5Accounts';
import useIsEuRegion from './useIsEuRegion';
import useMT5AccountsList from './useMT5AccountsList';

/** A custom hook to get the sorted added and non-added MT5 accounts. */
const useSortedMT5Accounts = (isEUClient: boolean = false) => {
    const { data: all_available_mt5_accounts } = useAvailableMT5Accounts();
    const { isEUCountry } = useIsEuRegion();
    const { data: mt5_accounts, ...rest } = useMT5AccountsList();
    const { data: activeAccount } = useActiveAccount();

    const isEU = isEUClient || isEUCountry;

    const modified_data = useMemo(() => {
        if (!all_available_mt5_accounts || !mt5_accounts) return;

        const filtered_available_accounts = isEU
            ? all_available_mt5_accounts.filter(account => account.shortcode === 'maltainvest')
            : all_available_mt5_accounts;

        const filtered_mt5_accounts = mt5_accounts.filter(
            account =>
                account.is_virtual === activeAccount?.is_virtual &&
                (isEU
                    ? account.landing_company_short === 'maltainvest'
                    : account.landing_company_short !== 'maltainvest')
        );

        const available_accounts = filtered_available_accounts
            .filter(available => {
                return (
                    !filtered_mt5_accounts.find(added => added.product === available.product) &&
                    // @ts-expect-error type for is_default_jurisdiction is unavailable in mt5_login_list and trading_platform_available_accounts
                    available.is_default_jurisdiction === 'true'
                );
            })
            //@ts-expect-error needs backend type
            .filter(account => !activeAccount?.is_virtual || account.product !== 'stp');

        const combined_accounts = [
            ...available_accounts.map(account => ({ ...account, is_added: false })),
            ...filtered_mt5_accounts.map(account => ({ ...account, is_added: true })),
        ];
        return combined_accounts;
    }, [activeAccount?.is_virtual, all_available_mt5_accounts, isEU, mt5_accounts]);

    const sorted_data = useMemo(() => {
        const sorting_order = ['standard', 'financial', 'stp', 'swap_free', 'zero_spread', 'gold'];

        if (!modified_data) return;

        const sorted_data = sorting_order.reduce(
            (acc, sort_order) => {
                const accounts = modified_data.filter(account => account.product === sort_order);
                if (!accounts.length) return acc;
                return [...acc, ...accounts];
            },
            [] as typeof modified_data
        );

        return sorted_data;
    }, [modified_data]);

    const areAllAccountsCreated = modified_data?.length === all_available_mt5_accounts?.length;

    return {
        data: sorted_data,
        /** Determine if all the accounts are created */
        areAllAccountsCreated,
        ...rest,
    };
};

export default useSortedMT5Accounts;
