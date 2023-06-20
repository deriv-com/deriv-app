import React from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';
import useWalletList from './useWalletsList';

const useDisplayAvailableWallets = () => {
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
        const { crypto, doughflow } = account_type_data?.get_account_types?.wallet;
        const crypto_currencies = crypto.currencies;
        const fiat_currencies = doughflow.currencies;

        if (!crypto_currencies || !fiat_currencies) return null;
        const available_wallets = [...fiat_currencies, ...crypto_currencies];

        // remove virtual from added_wallets
        const virtualIndex = added_wallets?.findIndex(wallet => wallet.is_virtual === 1);
        if (virtualIndex !== -1) {
            if (virtualIndex) added_wallets?.splice(virtualIndex, 1);
        }

        const unAddedWallets = available_wallets.filter(
            currency => !added_wallets?.some(added => added.currency === currency)
        );

        const addedWallets = available_wallets.filter(currency =>
            added_wallets?.some(added => added.currency === currency)
        );

        // Sort the unadded wallets alphabetically by fiat, crypto, then virtual
        unAddedWallets.sort((a, b) => {
            if (a.is_virtual !== b.is_virtual) {
                return a.is_virtual ? 1 : -1;
            } else if (is_crypto(a.currency) !== is_crypto(b.currency)) {
                return is_crypto(a.currency) ? 1 : -1;
            }
            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });

        // Sort the added wallets alphabetically based on the order of unadded wallets
        addedWallets.sort((a, b) => {
            const aIndex = unAddedWallets.findIndex(currency => currency === a.currency);
            const bIndex = unAddedWallets.findIndex(currency => currency === b.currency);
            return aIndex - bIndex;
        });

        return [...unAddedWallets, ...addedWallets].map(currency => ({
            currency,
            landing_company_shortcode: data?.authorize?.landing_company_name,
            added: added_wallets?.some(added => added.currency === currency),
        }));
    }, [added_wallets, account_type_data, data?.authorize?.landing_company_name, is_crypto]);

    return {
        ...rest,
        data: sortedWallets,
    };
};

export default useDisplayAvailableWallets;
