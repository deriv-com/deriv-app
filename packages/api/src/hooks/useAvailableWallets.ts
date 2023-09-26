import { useMemo } from 'react';
import useAllAvailableAccounts from './useAllAvailableAccounts';
import useCurrencyConfig from './useCurrencyConfig';
import useWalletAccountsList from './useWalletAccountsList';

/** A custom hook that gets the list of available wallets. */
const useAvailableWallets = () => {
    const { data: account_type_data, ...rest } = useAllAvailableAccounts();
    const { data: added_wallets } = useWalletAccountsList();
    const { getConfig } = useCurrencyConfig();

    /** Get the available wallets for the wallet account type */
    const modified_available_wallets = useMemo(() => {
        if (!account_type_data) return;
        const { crypto, doughflow } = account_type_data?.wallet || {};
        const crypto_currencies = crypto?.currencies;
        const fiat_currencies = doughflow?.currencies;

        if (!crypto_currencies || !fiat_currencies) return [];
        const available_currencies = [...fiat_currencies, ...crypto_currencies];
        const non_virtual_wallets = added_wallets?.filter(wallet => !wallet.is_virtual);

        /** Compare the available wallets with the added wallets and add `is_added` flag */
        const modified_wallets = non_virtual_wallets?.map(wallet => ({
            currency: wallet.currency,
            landing_company_name: wallet.landing_company_name,
            is_added: true,
        }));

        /** Compare the available wallets with the added wallets and add `is_added` flag */
        const available_wallets = available_currencies
            .filter(currency => !modified_wallets?.some(wallet => wallet.currency === currency))
            .map(currency => ({
                currency,
                landing_company_name: account_type_data?.landing_company,
                is_added: false,
            }));

        return [...available_wallets, ...(modified_wallets || [])];
    }, [account_type_data, added_wallets]);

    /** Sort the available wallets by fiat, crypto, then virtual */
    const sorted_available_wallets = useMemo(() => {
        if (!modified_available_wallets) return;

        const getConfigIsCrypto = (currency: string) => getConfig(currency)?.is_crypto;

        // Sort the non-added wallets alphabetically by fiat, crypto, then virtual
        modified_available_wallets.sort((a, b) => {
            const a_config = getConfigIsCrypto(a.currency || 'BTC');
            const b_config = getConfigIsCrypto(b.currency || 'BTC');

            if (a_config !== b_config) return a.currency ? 1 : -1;

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });

        // Sort the added wallets alphabetically by fiat, crypto, then virtual (if any)
        if (Array.isArray(modified_available_wallets)) {
            modified_available_wallets?.sort((a, b) => {
                const a_config = getConfigIsCrypto(a.currency || 'BTC');
                const b_config = getConfigIsCrypto(b.currency || 'BTC');
                if (a_config !== b_config) return a_config ? 1 : -1;

                return (a.currency || 'USD').localeCompare(b.currency || 'USD');
            });
        }

        return [...modified_available_wallets];
    }, [modified_available_wallets, getConfig]);

    return {
        /** Sorted available wallets */
        data: sorted_available_wallets,
        ...rest,
    };
};

export default useAvailableWallets;
