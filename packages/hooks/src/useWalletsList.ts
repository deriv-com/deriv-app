import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';
import useCurrencyConfig from './useCurrencyConfig';

/** A custom hook to get the list of wallets for the current user. */
const useWalletsList = () => {
    const { client, ui } = useStore();
    const { accounts, loginid } = client;
    const { is_dark_mode_on } = ui;
    const token = accounts[loginid || ''].token;
    const { getConfig } = useCurrencyConfig();

    const { data: authorize_data, ...reset } = useFetch('authorize', { payload: { authorize: token } });
    const { data: balance_data } = useFetch('balance', { payload: { account: 'all' } });

    const sortedWallets = useMemo(() => {
        const wallets = authorize_data?.authorize?.account_list?.filter(
            // @ts-expect-error Need to update @deriv/api-types to fix the TS error
            // Filter out accounts which has account_category as wallet
            account => account.account_category === 'wallet'
        );

        // Modify the wallet data to include additional information.
        const modified_wallets = wallets?.map(wallet => {
            const currency_type = wallet.is_virtual === 1 ? 'demo' : wallet.currency?.toLowerCase();

            return {
                ...wallet,
                /** Indicating whether the wallet is the currently selected wallet. */
                is_selected: wallet.loginid === loginid,
                /** Indicating whether the wallet is a virtual-money wallet. */
                is_demo: wallet.is_virtual === 1,
                /** Wallet balance */
                balance: balance_data?.balance?.accounts?.[wallet.loginid || '']?.balance || 0,
                /** Landing company shortcode the account belongs to. */
                landing_company_name: wallet.landing_company_name?.replace('maltainvest', 'malta'),
                /** Indicating whether the wallet is a maltainvest wallet. */
                is_malta_wallet: wallet.landing_company_name === 'malta',
                /** The gradient class name for the wallet header background. */
                gradient_header_class: `wallet-header__${currency_type}-bg${is_dark_mode_on ? '--dark' : ''}`,
                /** The gradient class name for the wallet card background. */
                gradient_card_class: `wallet-card__${currency_type}-bg${is_dark_mode_on ? '--dark' : ''}`,
                /** Wallet's currency config information */
                currency_config: wallet.currency ? getConfig(wallet.currency) : undefined,
            } as const;
        });

        // Sort the wallets alphabetically by fiat, crypto, then virtual.
        return modified_wallets?.sort((a, b) => {
            if (a.is_virtual !== b.is_virtual) {
                return a.is_virtual ? 1 : -1;
            } else if (a.currency_config?.is_crypto !== b.currency_config?.is_crypto) {
                return a.currency_config?.is_crypto ? 1 : -1;
            }

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });
    }, [authorize_data?.authorize?.account_list, loginid, balance_data?.balance?.accounts, is_dark_mode_on, getConfig]);

    return {
        /** List of wallets for current user. */
        data: sortedWallets,
        ...reset,
    };
};

export default useWalletsList;
