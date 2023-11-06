import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';
import useAuthorize from './useAuthorize';
import useCurrencyConfig from './useCurrencyConfig';

const currency_to_icon_mapper: Record<string, Record<'light' | 'dark', string>> = {
    Demo: {
        dark: 'IcWalletDerivDemoDark',
        light: 'IcWalletDerivDemoLight',
    },
    USD: {
        dark: 'IcWalletCurrencyUsd',
        light: 'IcWalletCurrencyUsd',
    },
    EUR: {
        dark: 'IcWalletCurrencyEur',
        light: 'IcWalletCurrencyEur',
    },
    AUD: {
        dark: 'IcWalletCurrencyAud',
        light: 'IcWalletCurrencyAud',
    },
    GBP: {
        dark: 'IcWalletCurrencyGbp',
        light: 'IcWalletCurrencyGbp',
    },
    BTC: {
        dark: 'IcWalletBitcoinDark',
        light: 'IcWalletBitcoinLight',
    },
    ETH: {
        dark: 'IcWalletEthereumDark',
        light: 'IcWalletEthereumLight',
    },
    USDT: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
    eUSDT: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
    tUSDT: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
    UST: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
    LTC: {
        dark: 'IcWalletLiteCoinDark',
        light: 'IcWalletLiteCoinLight',
    },
    USDC: {
        dark: 'IcWalletUsdCoinDark',
        light: 'IcWalletUsdCoinLight',
    },
};

/** A custom hook to get the list of wallets for the current user. */
const useWalletsList = () => {
    const { ui, client } = useStore();
    const { is_dark_mode_on } = ui;
    const { is_authorize } = client;
    const { getConfig } = useCurrencyConfig();

    const { data: authorize_data, isSuccess, ...rest } = useAuthorize();
    const { data: balance_data } = useFetch('balance', {
        payload: { account: 'all' },
        options: { enabled: is_authorize && isSuccess },
    });

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
            const wallet_currency_type = wallet.is_virtual === 1 ? 'Demo' : wallet.currency || '';
            const wallet_gradient_class_name = `${wallet_currency_type.toLowerCase()}-bg${
                is_dark_mode_on ? '--dark' : ''
            }`;
            const wallet_icon = currency_to_icon_mapper[wallet_currency_type];

            return {
                ...wallet,
                /** Indicating whether the wallet is the currently selected wallet. */
                is_selected: wallet.loginid === authorize_data?.loginid,
                /** Indicating whether the wallet is a virtual-money wallet. */
                is_demo: wallet.is_virtual === 1,
                /** Returns the wallet's currency type. ex: `Demo`, `USD`, etc. */
                wallet_currency_type,
                /** Landing company shortcode the account belongs to. */
                landing_company_name: wallet.landing_company_name?.replace('maltainvest', 'malta'),
                /** Indicating whether the wallet is a maltainvest wallet. */
                is_malta_wallet: wallet.landing_company_name === 'malta',
                /** The gradient class name for the wallet header background. */
                gradient_header_class: `wallet-header__${wallet_gradient_class_name}`,
                /** The gradient class name for the wallet card background. */
                gradient_card_class: `wallet-card__${wallet_gradient_class_name}`,
                /** Wallet's currency config information */
                currency_config: wallet.currency ? getConfig(wallet.currency) : undefined,
                /** Local asset name for the wallet icon. ex: `IcWalletCurrencyUsd` for `USD`  */
                icon: is_dark_mode_on ? wallet_icon.dark : wallet_icon.light,
            } as const;
        });
    }, [getConfig, is_dark_mode_on, authorize_data?.loginid, wallets_with_balance]);

    // Sort wallets alphabetically by fiat, crypto, then virtual.
    const sorted_wallets = useMemo(() => {
        if (!modified_wallets) return [];

        return [...modified_wallets].sort((a, b) => {
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
        /** Indicating whether the user has a wallet */
        has_wallet: sorted_wallets && sorted_wallets.length > 0,
        ...rest,
    };
};

export default useWalletsList;
