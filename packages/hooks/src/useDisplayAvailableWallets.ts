import React from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';
import useWalletList from './useWalletsList';

const useDisplayAvailableWallets = () => {
    const { client } = useStore();
    const { accounts, loginid } = client;
    const { data, ...rest } = useFetch('authorize', {
        payload: { authorize: accounts[loginid || ''].token },
        options: { enabled: Boolean(loginid) },
    });
    const { data: account_type_data } = useFetch('get_account_types', {
        payload: { company: data?.authorize?.landing_company_name },
        options: { enabled: Boolean(data?.authorize?.landing_company_name) },
    });

    const { data: added_wallets } = useWalletList();

    const sortedWallets = React.useMemo(() => {
        if (!account_type_data) return null;

        const { crypto, doughflow } = account_type_data?.get_account_types?.wallet;
        const crypto_currencies = crypto.currencies;
        const fiat_currencies = doughflow.currencies;

        if (!crypto_currencies || !fiat_currencies) return null;
        const available_wallets = [...fiat_currencies, ...crypto_currencies];

        return available_wallets.map(currency => ({
            currency,
            landing_company_shortcode: data?.authorize?.landing_company_name,
            added: added_wallets?.some(added => added.currency === currency),
        }));
    }, [added_wallets, account_type_data]);

    return {
        ...rest,
        data: sortedWallets,
    };
};

export default useDisplayAvailableWallets;
