import React from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';
import useWalletsList from './useWalletsList';
import useAuthorize from './useAuthorize';

const useAvailableWallets = () => {
    const { client, ui } = useStore();
    const { is_dark_mode_on } = ui;
    const { is_crypto } = client;
    const { data } = useAuthorize();

    const { data: account_type_data, ...rest } = useFetch('get_account_types', {
        payload: { company: data?.landing_company_name === 'virtual' ? 'svg' : data?.landing_company_name },
        options: { enabled: Boolean(data?.landing_company_name) },
    });

    const { data: added_wallets } = useWalletsList();

    const sortedWallets = React.useMemo(() => {
        if (!account_type_data) return null;
        const { crypto, doughflow } = account_type_data?.get_account_types?.wallet || {};
        const crypto_currencies = crypto?.currencies;
        const fiat_currencies = doughflow?.currencies;

        if (!crypto_currencies || !fiat_currencies) return null;
        const available_currencies = [...fiat_currencies, ...crypto_currencies];
        const non_virtual_wallets = added_wallets?.filter(wallet => !wallet.is_virtual);

        const modified_wallets = non_virtual_wallets?.map(wallet => ({
            currency: wallet.currency,
            landing_company_name: wallet.landing_company_name,
            is_added: true,
            gradient_card_class: wallet.gradient_card_class,
        }));

        const available_wallets = available_currencies
            .filter(currency => !modified_wallets?.some(wallet => wallet.currency === currency))
            .map(currency => ({
                currency,
                landing_company_name: data?.landing_company_name === 'virtual' ? 'svg' : data?.landing_company_name,
                is_added: false,
                gradient_card_class: `wallet-card__${currency.toLowerCase()}-bg${is_dark_mode_on ? '--dark' : ''}`,
            }));

        // Sort the unadded wallets alphabetically by fiat, crypto, then virtual
        available_wallets?.sort((a, b) => {
            if (is_crypto(a.currency) !== is_crypto(b.currency)) {
                return is_crypto(a.currency) ? 1 : -1;
            }

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });

        // Sort the added wallets alphabetically by fiat, crypto, then virtual (if any)
        if (Array.isArray(modified_wallets)) {
            modified_wallets?.sort((a, b) => {
                if (is_crypto(a.currency) !== is_crypto(b.currency)) {
                    return is_crypto(a.currency) ? 1 : -1;
                }

                return (a.currency || 'USD').localeCompare(b.currency || 'USD');
            });
            return [...available_wallets, ...modified_wallets];
        }

        return [...available_wallets];
    }, [added_wallets, account_type_data, data?.landing_company_name, is_dark_mode_on, is_crypto]);

    return {
        ...rest,
        data: sortedWallets,
    };
};

export default useAvailableWallets;
