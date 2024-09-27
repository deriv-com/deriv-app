import { useMemo } from 'react';
import useMT5AccountsList from './useMT5AccountsList';
import useAvailableMT5Accounts from './useAvailableMT5Accounts';
import useIsEuRegion from './useIsEuRegion';
import useActiveAccount from './useActiveAccount';

/** A custom hook to get the sorted added and non-added MT5 accounts. */
const useSortedMT5Accounts = (regulation?: string) => {
    const { data: all_available_mt5_accounts } = useAvailableMT5Accounts();
    const { isEUCountry } = useIsEuRegion();
    const { data: mt5_accounts, ...rest } = useMT5AccountsList();
    const { data: activeAccount } = useActiveAccount();

    const isEU = regulation === 'EU' || isEUCountry;

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

        return filtered_available_accounts?.map(available_account => {
            const created_account = filtered_mt5_accounts?.find(account => {
                return (
                    available_account.market_type === account.market_type &&
                    available_account.shortcode === account.landing_company_short
                );
            });

            if (created_account)
                return {
                    ...created_account,
                    /** Determine if the account is added or not */
                    is_added: true,
                } as const;

            return {
                ...available_account,
                /** Determine if the account is added or not */
                is_added: false,
            } as const;
        });
    }, [activeAccount?.is_virtual, all_available_mt5_accounts, isEU, mt5_accounts]);

    // // Reduce out the added and non added accounts to make sure only one of each market_type is shown for not added
    const filtered_data = useMemo(() => {
        if (!modified_data) return;

        const added_accounts = modified_data.filter(account => account.is_added);
        const non_added_accounts = modified_data.filter(
            // @ts-expect-error - remove this once kyc_status types are available for mt5_login_list and trading_platform_available_accounts from BE
            account => !account.is_added && account.is_default_jurisdiction === 'true' && account.product !== 'stp'
        );

        return [...added_accounts, ...non_added_accounts];
    }, [modified_data]);

    // Sort the data by market_type and product to make sure the order is 'synthetic', 'financial', 'swap_free' and 'zero_spread'
    const sorted_data = useMemo(() => {
        const sorting_order = ['synthetic', 'financial', 'swap_free', 'zero_spread'];

        if (!filtered_data) return;

        const sorted_data = sorting_order.reduce((acc, sort_order) => {
            const accounts = filtered_data.filter(account => {
                if (account.market_type === 'all') {
                    return account.product === sort_order;
                }
                return account.market_type === sort_order;
            });
            if (!accounts.length) return acc;
            return [...acc, ...accounts];
        }, [] as typeof filtered_data);

        return sorted_data;
    }, [filtered_data]);

    const areAllAccountsCreated = sorted_data?.length === all_available_mt5_accounts?.length;

    return {
        data: sorted_data,
        /** Determine if all the accounts are created */
        areAllAccountsCreated,
        ...rest,
    };
};

export default useSortedMT5Accounts;
