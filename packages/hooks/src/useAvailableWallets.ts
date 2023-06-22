import React from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';
import useWalletList from './useWalletsList';

const useAvailableWallets = () => {
    const { client } = useStore();
    const { accounts, loginid, is_crypto } = client;
    const { data, ...rest } = useFetch('authorize', {
        payload: { authorize: accounts[loginid || ''].token },
        options: { enabled: Boolean(loginid) },
    });

    // @ts-expect-error Need to update @deriv/api-types to fix the TS error
    const { data: account_type_data } = useFetch('get_account_types', {
        payload: { company: data?.authorize?.landing_company_name },
        options: { enabled: Boolean(data?.authorize?.landing_company_name) },
    });

    const { data: added_wallets } = useWalletList();

    const sortedWallets = React.useMemo(() => {
        if (!account_type_data) return null;
        // @ts-expect-error Need to update @deriv/api-types to fix the TS error
        const { crypto, doughflow } = account_type_data?.get_account_types?.wallet || {};
        const crypto_currencies = crypto.currencies;
        const fiat_currencies = doughflow.currencies;

        if (!crypto_currencies || !fiat_currencies) return null;
        const available_currencies = [...fiat_currencies, ...crypto_currencies];

        const non_virtual_wallets = added_wallets?.filter(wallet => wallet.is_virtual !== 1);

        const modified_wallets = non_virtual_wallets?.map(wallet => ({
            currency: wallet.currency,
            landing_company_shortcode: wallet.landing_company_shortcode,
            is_added: available_currencies.includes(wallet.currency),
        }));

        const available_wallets = available_currencies
            .filter(currency => !modified_wallets?.some(wallet => wallet.currency === currency))
            .map(currency => ({
                currency,
                landing_company_shortcode: data?.authorize?.landing_company_name,
                is_added: false,
            }));

        const all_wallets_list = [...available_wallets, ...(modified_wallets || [])];

        // Sort the unadded wallets alphabetically by fiat, crypto, then virtual
        all_wallets_list?.sort((a, b) => {
            if (a.is_added) return 1;

            if (is_crypto(a.currency) !== is_crypto(b.currency)) {
                return is_crypto(a.currency) ? 1 : -1;
            }

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });

        return all_wallets_list;
    }, [added_wallets, account_type_data, data?.authorize?.landing_company_name, is_crypto]);

    return {
        ...rest,
        data: sortedWallets,
    };
};

export default useAvailableWallets;
