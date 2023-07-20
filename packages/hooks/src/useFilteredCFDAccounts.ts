import { useMemo } from 'react';
import useAvailableMT5Accounts from './useAvailableMT5Accounts';
import useExistingCFDAccounts from './useExistingCFDAccounts';
import { useStore } from '@deriv/stores';

/**
 *
 * @description This hook is to compare the available MT5 accounts with the existing CFD accounts and return the filtered list.
 *
 */
const useFilteredCFDAccounts = () => {
    const { data: available_mt5_accounts, isLoading } = useAvailableMT5Accounts();
    const { data: existing_cfd_accounts, isLoading: existing_cfd_accounts_loading } = useExistingCFDAccounts();
    const { traders_hub } = useStore();
    const { getShortCodeAndRegion } = traders_hub;

    const combined_mt5_accounts = useMemo(() => {
        if (!available_mt5_accounts) return undefined;

        return (
            Object.keys(available_mt5_accounts)
                // Map over available market types
                .map(market_type => {
                    // Change the market type from 'gaming' to 'synthetic' to match the existing CFD accounts
                    const modified_market_type = market_type.replace('gaming', 'synthetic');

                    // Find the existing CFD account that matches the market type
                    const existing_mt5_accounts = existing_cfd_accounts?.mt5_accounts?.filter(
                        mt5 => mt5.market_type === modified_market_type
                    );

                    // Map over the available accounts and add the existing CFD account if it exists
                    return available_mt5_accounts[market_type].map((available, index) => {
                        // Find the existing CFD account with the index
                        const existing_mt5_account = existing_mt5_accounts?.[index];

                        // Check if the account is added
                        const is_added = !!existing_mt5_account;

                        return {
                            ...available,
                            ...existing_mt5_account,
                            market_type: modified_market_type,
                            short_code_and_region: getShortCodeAndRegion(existing_mt5_account || available),
                            is_added,
                        };
                    });
                })
        );
    }, [available_mt5_accounts, existing_cfd_accounts?.mt5_accounts, getShortCodeAndRegion]);

    const categorized_mt5_accounts = useMemo(() => {
        const categorized_accounts = combined_mt5_accounts?.flat().reduce((acc, account) => {
            const { market_type } = account;
            if (!acc[market_type]) acc[market_type] = [];
            acc[market_type].push(account);
            return acc;
        }, {} as Record<string, typeof combined_mt5_accounts[number]>);

        return Object.fromEntries(
            Object.entries(categorized_accounts || {}).map(([market_type, accounts]) => {
                const added_accounts = accounts.filter(account => account.is_added);
                const not_added_accounts = accounts.filter(account => !account.is_added);
                return [market_type, added_accounts.length ? added_accounts : [not_added_accounts[0]]];
            })
        );
    }, [combined_mt5_accounts]);

    return {
        data: categorized_mt5_accounts,
        isLoading: isLoading || existing_cfd_accounts_loading,
    };
};

export default useFilteredCFDAccounts;
