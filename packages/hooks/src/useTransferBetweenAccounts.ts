import { useMemo } from 'react';
import { useStore } from '@deriv/stores';
import { useFetch } from '@deriv/api';
import useActiveWallet from './useActiveWallet';
import useActiveWalletCFDAccounts from './useActiveWalletCFDAccounts';
import useCurrencyConfig from './useCurrencyConfig';
import useWalletsList from './useWalletsList';

const useTransferBetweenAccounts = () => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;

    const active_wallet = useActiveWallet();

    const { data: wallets } = useWalletsList();

    const { getConfig } = useCurrencyConfig();

    const trading_apps_icon = is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight';

    const {
        data: { derivez_accounts, dxtrade_accounts, mt5_accounts },
        is_success: is_cfd_accounts_loaded,
    } = useActiveWalletCFDAccounts();

    const { data, ...rest } = useFetch('transfer_between_accounts', {
        payload: { accounts: 'all' },
        options: { enabled: is_cfd_accounts_loaded },
    });

    const modified_transfer_accounts = useMemo(() => {
        const all_linked_cfd_accounts = [...derivez_accounts, ...dxtrade_accounts, ...mt5_accounts];

        const getAccountType = (is_demo?: number, currency?: string): 'fiat' | 'crypto' | 'demo' => {
            if (is_demo) return 'demo';
            return getConfig(currency || '')?.is_crypto ? 'crypto' : 'fiat';
        };

        const accounts = data?.accounts?.map(account => {
            return {
                ...account,
                active_wallet_icon: active_wallet?.icon,
                balance: parseFloat(
                    Number(account.balance).toFixed(getConfig(account.currency || '')?.fractional_digits)
                ),
                display_currency_code: getConfig(account.currency || '')?.display_code,
                is_demo: Boolean(account?.demo_account),
                shortcode: active_wallet?.landing_company_name,
                type: getAccountType(account.demo_account, account.currency),
            };
        });

        return {
            trading:
                accounts?.reduce(
                    (all_trading_accounts, account) => {
                        if (account.account_type === 'wallet') return all_trading_accounts;
                        if (!account.loginid) return all_trading_accounts;

                        const cfd_icon = all_linked_cfd_accounts.find(
                            cfd_account => account.loginid && cfd_account.loginid?.includes(account.loginid)
                        )?.icon;

                        all_trading_accounts[account.loginid] = {
                            ...account,
                            gradient_class: active_wallet?.gradient_card_class,
                            icon: account.account_type === 'trading' ? trading_apps_icon : cfd_icon,
                            ...(account.account_type === 'mt5' && {
                                mt5_market_type: mt5_accounts?.find(
                                    mt5_account => account.loginid && mt5_account.loginid?.includes(account.loginid)
                                )?.market_type,
                            }),
                        };

                        return all_trading_accounts;
                    },
                    {} as Record<
                        string,
                        NonNullable<
                            typeof accounts[number] & {
                                gradient_class?: `wallet-card__${string}`;
                                icon?: string;
                                mt5_market_type?: 'all' | 'financial' | 'synthetic';
                            }
                        >
                    >
                ) || {},
            wallets:
                accounts?.reduce(
                    (all_wallets, wallet) => {
                        if (wallet.account_type !== 'wallet') return all_wallets;
                        if (!wallet.loginid) return all_wallets;

                        const available_wallet = wallets?.find(acc => acc.loginid === wallet.loginid);

                        all_wallets[wallet.loginid] = {
                            ...wallet,
                            icon: available_wallet?.icon,
                            gradient_class: available_wallet?.gradient_card_class,
                        };

                        return all_wallets;
                    },
                    {} as Record<
                        string,
                        NonNullable<
                            typeof accounts[number] & {
                                gradient_class?: `wallet-card__${string}`;
                                icon?: string;
                            }
                        >
                    >
                ) || {},
        };
    }, [
        active_wallet?.gradient_card_class,
        active_wallet?.icon,
        active_wallet?.landing_company_name,
        data?.accounts,
        derivez_accounts,
        dxtrade_accounts,
        getConfig,
        mt5_accounts,
        trading_apps_icon,
        wallets,
    ]);

    const modified_active_wallet = useMemo(() => {
        return active_wallet?.loginid
            ? {
                  ...modified_transfer_accounts.wallets[active_wallet?.loginid],
              }
            : undefined;
    }, [active_wallet?.loginid, modified_transfer_accounts.wallets]);

    return {
        ...rest,
        active_wallet: modified_active_wallet,
        transfer_trading_accounts: modified_transfer_accounts.trading,
        transfer_wallets: modified_transfer_accounts.wallets,
    };
};

export default useTransferBetweenAccounts;
