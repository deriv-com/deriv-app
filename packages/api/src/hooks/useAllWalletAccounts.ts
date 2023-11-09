import { useCallback, useMemo } from 'react';
import useCurrencyConfig from './useCurrencyConfig';
import useWalletAccountsList from './useWalletAccountsList';
import useAvailableWallets from './useAvailableWallets';

/** A custom hook that gets the list of added and non-added wallet accounts. */
const useAllWalletAccounts = () => {
    const { data: non_added_wallets, ...rest } = useAvailableWallets();
    const { data: added_wallets } = useWalletAccountsList();
    const { getConfig } = useCurrencyConfig();

    /** Get all the added and non-added wallets account */
    const modified_wallets = useMemo(() => {
        const non_virtual_wallets = added_wallets?.filter(wallet => !wallet.is_virtual);

        /** Modify added wallets list with adding `is_added` and `is_crypto` flag */
        const modified_added_wallets = non_virtual_wallets?.map(wallet => ({
            currency: wallet.currency,
            landing_company_name: wallet.landing_company_name,
            is_added: true,
            is_crypto: wallet.currency ? getConfig(wallet.currency)?.is_crypto : false,
        }));

        /** Modify non-added wallets list with adding `is_added` and `is_crypto` flag */
        const modified_non_added_wallets = non_added_wallets?.map(wallet => ({
            currency: wallet.currency,
            landing_company_name: wallet.landing_company,
            is_added: false,
            is_crypto: wallet.account_type === 'crypto',
        }));

        return [...(modified_non_added_wallets || []), ...(modified_added_wallets || [])];
    }, [non_added_wallets, added_wallets, getConfig]);

    /** Function to sort wallet based on currency */
    const sortWalletsByCurrency = useCallback(
        (a: typeof modified_wallets[number], b: typeof modified_wallets[number]) => {
            if (a.is_crypto !== b.is_crypto) return a.is_crypto ? 1 : -1;

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        },
        []
    );

    /** Sort the wallets by fiat, crypto, then virtual */
    const sorted_wallets = useMemo(() => {
        if (!modified_wallets) return;

        // Sort wallets by non-added wallets then added wallets
        modified_wallets.sort((a, b) => {
            if (a.is_added !== b.is_added) return a.is_added ? 1 : -1;

            return 0;
        });

        // Sort the added wallets alphabetically by fiat, crypto, then virtual (if any)
        modified_wallets.sort((a, b) => {
            if (!a.is_added || !b.is_added) return 0;
            return sortWalletsByCurrency(a, b);
        });

        // Sort the non-added wallets alphabetically by fiat, crypto, then virtual (if any)
        modified_wallets.sort((a, b) => {
            if (a.is_added || b.is_added) return 0;
            return sortWalletsByCurrency(a, b);
        });

        return [...modified_wallets];
    }, [modified_wallets, sortWalletsByCurrency]);

    return {
        /** Sorted wallets accounts */
        data: sorted_wallets,
        ...rest,
    };
};

export default useAllWalletAccounts;
