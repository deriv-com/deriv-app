import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';
import { getWalletCurrencyIcon } from '@deriv/utils';
import useCurrencyConfig from './useCurrencyConfig';

const useWalletsList = () => {
    const { client, ui } = useStore();
    const { getConfig } = useCurrencyConfig();
    const { accounts, currency, loginid } = client;
    const { is_dark_mode_on } = ui;
    const { data, ...reset } = useFetch('authorize', {
        payload: { authorize: accounts[loginid || ''].token },
        options: { enabled: Boolean(loginid), keepPreviousData: true },
    });
    const { data: balance_data } = useFetch('balance', { payload: { account: 'all' } });

    const sortedWallets = useMemo(() => {
        // Filter out accounts which has account_category as wallet
        const wallets = data?.authorize?.account_list?.filter(account => account.account_category === 'wallet');

        // Modify the wallets to include the missing balance from the API response
        // Should remove this once the API is fixed
        const modified_wallets = wallets?.map(wallet => ({
            ...wallet,
            /** Wallet balance */
            balance: balance_data?.balance?.accounts?.[wallet.loginid || '']?.balance || 0,
            /** Gradient background class for cashier wallet modal header*/
            gradient_header_class: `wallet-header__${
                wallet.is_virtual === 1 ? 'demo' : wallet.currency?.toLowerCase()
            }-bg${is_dark_mode_on ? '--dark' : ''}`,
            /** Gradient background class for wallet card*/
            gradient_card_class: `wallet-card__${wallet.is_virtual === 1 ? 'demo' : wallet.currency?.toLowerCase()}-bg${
                is_dark_mode_on ? '--dark' : ''
            }`,
            /** Wallet icon */
            icon: getWalletCurrencyIcon(wallet.is_virtual ? 'demo' : currency, is_dark_mode_on),
            /** Indicating whether the wallet is crypto or fiat */
            is_crypto: getConfig(wallet.currency || '')?.is_crypto,
            /** Indicating whether the wallet is a virtual-money wallet. */
            is_demo: wallet.is_virtual === 1,
            /** Indicating whether the wallet is belong to malta jurisdiction */
            is_malta_wallet: wallet.landing_company_name === 'malta',
            /** Indicating whether the wallet is the currently selected wallet. */
            is_selected: wallet.loginid === loginid,
            /** Landing company shortcode the account belongs to. Use this instead of landing_company_shortcode for wallets */
            landing_company_name: wallet.landing_company_name === 'maltainvest' ? 'malta' : wallet.landing_company_name,
            /** Wallet display name */
            name: `${wallet.is_virtual ? 'Demo ' : ''}${currency} ${'Wallet'}`,
        }));

        // Sort the wallets alphabetically by fiat, crypto, then virtual
        return modified_wallets?.sort((a, b) => {
            if (a.is_virtual !== b.is_virtual) {
                return a.is_virtual ? 1 : -1;
            } else if (getConfig(a.currency||'')?.is_crypto !== getConfig(b.currency||'')?.is_crypto) {
                return getConfig(a.currency||'')?.is_crypto ? 1 : -1;
            }

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });
    }, [balance_data?.balance?.accounts, data?.authorize?.account_list, loginid, is_dark_mode_on]);

    return {
        ...reset,
        data: sortedWallets,
    };
};

export default useWalletsList;