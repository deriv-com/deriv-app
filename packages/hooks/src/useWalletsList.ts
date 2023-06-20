import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';
import useCurrencyConfig from './useCurrencyConfig';

const useWalletList = () => {
    const { client } = useStore();
    const { accounts, loginid, is_crypto } = client;
    const { data, ...reset } = useFetch('authorize', {
        payload: { authorize: accounts[loginid || ''].token },
        options: { enabled: Boolean(loginid), keepPreviousData: true },
    });
    const { data: balance_data } = useFetch('balance', { payload: { account: 'all' } });
    // const { data: test } = useFetch('website_status');

    const { getConfig } = useCurrencyConfig();

    const sortedWallets = useMemo(() => {
        // @ts-expect-error Need to update @deriv/api-types to fix the TS error
        // Filter out accounts which has account_category as wallet
        const wallets = data?.authorize?.account_list?.filter(account => account.account_category === 'wallet');

        // Modify the wallets to include the missing balance from the API response
        // Should remove this once the API is fixed
        const modified_wallets =
            wallets?.map(wallet => {
                const currency_config = getConfig(wallet?.currency || 'USD');
                const is_crypto_currency = currency_config?.is_crypto;
                const is_fiat = currency_config?.is_fiat;
                const currency_display_code = currency_config?.display_code || '';
                const icon = currency_config?.icon;
                const name = `${wallet.is_virtual ? 'Demo' : ''} ${currency_display_code} ${'Wallet'}`;

                return {
                    ...wallet,
                    /** Indicating whether the wallet is a virtual-money wallet. */
                    is_demo: wallet.is_virtual === 1,
                    /** Wallet balance */
                    balance: balance_data?.balance?.accounts?.[wallet.loginid || '']?.balance || 0,
                    /** Landing company shortcode the account belongs to. */
                    landing_company_name:
                        wallet.landing_company_name === 'maltainvest' ? 'malta' : wallet.landing_company_name,
                    /** @deprecated should use `landing_company_name` instead */
                    landing_company_shortcode:
                        wallet.landing_company_name === 'maltainvest' ? 'malta' : wallet.landing_company_name,
                    is_disabled: Boolean(wallet.is_disabled),
                    is_virtual: Boolean(wallet.is_virtual),
                    is_crypto: is_crypto_currency,
                    is_fiat,
                    currency_display_code,
                    icon,
                    name,
                    // needs for WalletIcon, maybe refactor during cleanUp
                    icon_type: is_fiat && !wallet.is_virtual ? 'fiat' : 'crypto',
                };
            }) || [];

        // Sort the wallets alphabetically by fiat, crypto, then virtual
        return modified_wallets?.sort((a, b) => {
            if (a.is_virtual !== b.is_virtual) {
                return a.is_virtual ? 1 : -1;
            } else if (is_crypto(a.currency) !== is_crypto(b.currency)) {
                return is_crypto(a.currency) ? 1 : -1;
            }

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });
    }, [balance_data?.balance?.accounts, data?.authorize?.account_list, getConfig, is_crypto]);

    return {
        ...reset,
        data: sortedWallets,
    };
};

export default useWalletList;
