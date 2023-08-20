import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import useActiveWalletAccount from './useActiveWalletAccount';
import useCurrencyConfig from './useCurrencyConfig';
import useExistingCFDAccounts from './useExistingCFDAccounts';
import useWalletAccountsList from './useWalletAccountsList';

const useTransferBetweenAccounts = () => {
    const { data: wallets } = useWalletAccountsList();
    const active_wallet = useActiveWalletAccount();
    const { getConfig } = useCurrencyConfig();

    const trading_apps_icon = 'IcWalletOptionsLight';

    const {
        data: { derivez_accounts, dxtrade_accounts, mt5_accounts },
        isSuccess: is_cfd_accounts_loaded,
    } = useExistingCFDAccounts();

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
            trading_accounts:
                accounts?.reduce(
                    (trading_accounts, account) => {
                        if (account.account_type === 'wallet') return trading_accounts;
                        if (!account.loginid) return trading_accounts;

                        const cfd_icon = all_linked_cfd_accounts.find(
                            cfd_account => account.loginid && cfd_account.loginid?.includes(account.loginid)
                        )?.transfer_icon;

                        trading_accounts[account.loginid] = {
                            ...account,
                            gradient_class: active_wallet?.gradient_card_class,
                            icon: account.account_type === 'trading' ? trading_apps_icon : cfd_icon,
                            ...(account.account_type === 'mt5' && {
                                mt5_market_type: mt5_accounts?.find(
                                    mt5_account => account.loginid && mt5_account.loginid?.includes(account.loginid)
                                )?.market_type,
                            }),
                        };

                        return trading_accounts;
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
            wallet_accounts:
                accounts?.reduce(
                    (wallet_accounts, wallet) => {
                        if (wallet.account_type !== 'wallet') return wallet_accounts;
                        if (!wallet.loginid) return wallet_accounts;

                        const available_wallet = wallets?.find(acc => acc.loginid === wallet.loginid);

                        wallet_accounts[wallet.loginid] = {
                            ...wallet,
                            icon: available_wallet?.icon,
                            gradient_class: available_wallet?.gradient_card_class,
                        };

                        return wallet_accounts;
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
                  ...modified_transfer_accounts.wallet_accounts[active_wallet?.loginid],
              }
            : undefined;
    }, [active_wallet?.loginid, modified_transfer_accounts.wallet_accounts]);

    return {
        ...rest,
        active_wallet: modified_active_wallet,
        trading_accounts: modified_transfer_accounts.trading_accounts,
        wallet_accounts: modified_transfer_accounts.wallet_accounts,
    };
};

export default useTransferBetweenAccounts;
