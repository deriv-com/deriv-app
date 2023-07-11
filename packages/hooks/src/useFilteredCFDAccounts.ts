import { useMemo } from 'react';
import useAvailableMT5Accounts from './useAvailableMT5Accounts';
import useExistingCFDAccounts from './useExistingCFDAccounts';

/**
 *
 * @description This hook is to compare the available MT5 accounts with the existing CFD accounts and return the filtered list.
 *
 */
const useFilteredCFDAccounts = () => {
    const { data } = useAvailableMT5Accounts();
    const { data: existing_cfd_accounts } = useExistingCFDAccounts();

    const filtered_mt5_accounts = useMemo(() => {
        if (!data) return undefined;

        return Object.keys(data)
            .map(key => {
                const added_account = existing_cfd_accounts?.mt5_accounts?.find(
                    cfd => cfd.market_type === data[key][0].market_type
                );

                return {
                    ...data[key][0],
                    ...added_account,
                    is_added: !!added_account,
                };
            })
            .sort((a, b) => {
                const market_type_order = ['gaming', 'financial', 'all'];

                return market_type_order.indexOf(a.market_type) - market_type_order.indexOf(b.market_type);
            });
    }, [data, existing_cfd_accounts]);

    return {
        data: filtered_mt5_accounts,
    };
};

export default useFilteredCFDAccounts;
