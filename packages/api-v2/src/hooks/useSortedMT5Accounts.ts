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
        const non_added_accounts = modified_data.filter(account => !account.is_added);

        const filtered_non_added_accounts = non_added_accounts.reduce((acc, account) => {
            const existing_account = acc.find(acc_account => acc_account.market_type === account.market_type);
            const added_account = added_accounts.find(acc_account => acc_account.market_type === account.market_type);
            if (existing_account || added_account) return acc;

            return [...acc, account];
        }, [] as typeof non_added_accounts);

        return [...added_accounts, ...filtered_non_added_accounts];
    }, [modified_data]);

    // Sort the data by market_type to make sure the order is 'synthetic', 'financial', 'all'
    const sorted_data = useMemo(() => {
        const market_type_order = ['synthetic', 'financial', 'all'];

        if (!filtered_data) return;

        const sorted_data = market_type_order.reduce((acc, market_type) => {
            const accounts = filtered_data.filter(account => account.market_type === market_type);
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
