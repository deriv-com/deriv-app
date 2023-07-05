import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';
import useAuthorize from './useAuthorize';
import useCurrencyConfig from './useCurrencyConfig';

/** A custom hook to get the list of wallets for the current user. */
const useWalletsList = () => {
    const { client, ui } = useStore();
    const { loginid } = client;
    const { is_dark_mode_on } = ui;
    const { getConfig } = useCurrencyConfig();

    const { data: authorize_data, ...rest } = useAuthorize();
    const { data: balance_data } = useFetch('balance', { payload: { account: 'all' } });

    // Filter out non-wallet accounts.
    const wallets = useMemo(
        () => authorize_data?.account_list?.filter(account => account.account_category === 'wallet'),
        [authorize_data?.account_list]
    );

    // Add balance to each wallet.
    const wallets_with_balance = useMemo(
        () =>
            wallets?.map(wallet => ({
                ...wallet,
                /** Wallet balance */
                balance: balance_data?.balance?.accounts?.[wallet.loginid || '']?.balance || 0,
            })),
        [balance_data?.balance?.accounts, wallets]
    );

    // Add additional information to each wallet.
    const modified_wallets = useMemo(() => {
        return wallets_with_balance?.map(wallet => {
            const currency_type = wallet.is_virtual === 1 ? 'demo' : wallet.currency?.toLowerCase();

            return {
                ...wallet,
                /** Indicating whether the wallet is the currently selected wallet. */
                is_selected: wallet.loginid === loginid,
                /** Indicating whether the wallet is a virtual-money wallet. */
                is_demo: wallet.is_virtual === 1,
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
    }, [getConfig, is_dark_mode_on, loginid, wallets_with_balance]);

    // Sort wallets alphabetically by fiat, crypto, then virtual.
    const sorted_wallets = useMemo(() => {
        return modified_wallets?.sort((a, b) => {
            if (a.is_virtual !== b.is_virtual) {
                return a.is_virtual ? 1 : -1;
            } else if (a.currency_config?.is_crypto !== b.currency_config?.is_crypto) {
                return a.currency_config?.is_crypto ? 1 : -1;
            }

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });
    }, [modified_wallets]);

    return {
        /** List of wallets for current user. */
        data: sorted_wallets,
        ...rest,
    };
};

export default useWalletsList;
