import React from 'react';
import { useFetch } from '@deriv/api';
import useAuthorize from './useAuthorize';
import useWalletAccountsList from './useWalletAccountsList';
import useCurrencyConfig from './useCurrencyConfig';

const useAvailableWallets = () => {
    const { data } = useAuthorize();

    const { data: account_type_data, ...rest } = useFetch('get_account_types', {
        payload: { company: data?.landing_company_name === 'virtual' ? 'svg' : data?.landing_company_name },
        options: { enabled: Boolean(data?.landing_company_name) },
    });

    const { data: added_wallets } = useWalletAccountsList();
    const { getConfig } = useCurrencyConfig();

    const sortedWallets = React.useMemo(() => {
        if (!account_type_data) return null;
        const { crypto, doughflow } = account_type_data?.get_account_types?.wallet || {};
        const crypto_currencies = crypto?.currencies;
        const fiat_currencies = doughflow?.currencies;

        if (!crypto_currencies || !fiat_currencies) return null;
        const available_currencies = [...fiat_currencies, ...crypto_currencies];
        const non_virtual_wallets = added_wallets?.filter(wallet => !wallet.is_virtual);

        const modified_wallets = non_virtual_wallets?.map(wallet => ({
            currency: wallet.currency ?? 'USD',
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
                gradient_card_class: `wallet-card__${currency.toLowerCase()}-bg`,
            }));

        // Sort the unadded wallets alphabetically by fiat, crypto, then virtual
        available_wallets?.sort((a, b) => {
            if (getConfig(a.currency)?.is_crypto !== getConfig(b.currency)?.is_crypto) {
                return getConfig(a.currency)?.is_crypto ? 1 : -1;
            }

            return a.currency.localeCompare(b.currency);
        });

        // Sort the added wallets alphabetically by fiat, crypto, then virtual (if any)
        if (Array.isArray(modified_wallets)) {
            modified_wallets?.sort((a, b) => {
                if (getConfig(a.currency)?.is_crypto !== getConfig(b.currency)?.is_crypto) {
                    return getConfig(a.currency)?.is_crypto ? 1 : -1;
                }

                return a.currency.localeCompare(b.currency);
            });
            return [...available_wallets, ...modified_wallets];
        }

        return [...available_wallets];
    }, [account_type_data, added_wallets, data?.landing_company_name, getConfig]);

    return {
        ...rest,
        data: sortedWallets,
    };
};

export default useAvailableWallets;
