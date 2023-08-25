import { useMemo } from 'react';
import useAccountsList from './useAccountsList';

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

/** A custom hook that gets the list of all wallet accounts for the current user. */
const useWalletAccountsList = () => {
    const { data: account_list_data, ...rest } = useAccountsList();

    // Filter out non-wallet accounts.
    const filtered_accounts = useMemo(
        () => account_list_data?.filter(account => account.is_wallet),
        [account_list_data]
    );

    // Add additional information to each wallet account.
    const modified_accounts = useMemo(() => {
        return filtered_accounts?.map(wallet => {
            const wallet_currency_type = wallet.is_virtual ? 'Demo' : wallet.currency || '';

            const gradients = {
                /** The gradient class name for the wallet header background. */
                header: {
                    dark: `wallet-header__${wallet_currency_type.toLowerCase()}-bg--dark`,
                    light: `wallet-header__${wallet_currency_type.toLowerCase()}-bg`,
                },
                /** The gradient class name for the wallet card background. */
                card: {
                    dark: `wallet-card__${wallet_currency_type.toLowerCase()}-bg--dark`,
                    light: `wallet-card__${wallet_currency_type.toLowerCase()}-bg`,
                },
            } as const;

            return {
                ...wallet,
                /** Returns the wallet's currency type. ex: `Demo`, `USD`, etc. */
                wallet_currency_type,
                /** Landing company shortcode the account belongs to. */
                landing_company_name: wallet.landing_company_name?.replace('maltainvest', 'malta'),
                /** Indicating whether the wallet is a maltainvest wallet. */
                is_malta_wallet: wallet.landing_company_name === 'malta',
                /** The gradient class names for the wallet header and card background. */
                gradients,
                /** Local asset names for the wallet icon. ex: `IcWalletCurrencyUsd` for `USD`  */
                icons: currency_to_icon_mapper[wallet_currency_type],

                /** @deprecated Use `is_virtual` instead. */
                is_demo: wallet.is_virtual,
                /** @deprecated Use `is_active` instead. */
                is_selected: wallet.is_active,
                /** @deprecated Use `gradients.header.light or gradients.header.dark` instead. */
                gradient_header_class: gradients.header.light,
                /** @deprecated Use `gradients.card.light or gradients.card.dark` instead. */
                gradient_card_class: gradients.card.light,
                /** @deprecated Use `icons.light or icons.dark` instead. */
                icon: currency_to_icon_mapper[wallet_currency_type].light,
            } as const;
        });
    }, [filtered_accounts]);

    // Sort wallet accounts alphabetically by fiat, crypto, then virtual.
    const sorted_accounts = useMemo(() => {
        if (!modified_accounts) return [];

        return [...modified_accounts].sort((a, b) => {
            if (a.is_virtual !== b.is_virtual) {
                return a.is_virtual ? 1 : -1;
            } else if (a.currency_config?.is_crypto !== b.currency_config?.is_crypto) {
                return a.currency_config?.is_crypto ? 1 : -1;
            }

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });
    }, [modified_accounts]);

    return {
        /** List of all wallet accounts for the current user. */
        data: sorted_accounts,
        /** Indicating whether the user has a wallet */
        has_wallet: sorted_accounts && sorted_accounts.length > 0,
        ...rest,
    };
};

export default useWalletAccountsList;
