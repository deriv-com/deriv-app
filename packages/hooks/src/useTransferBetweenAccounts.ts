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

    const trading_apps_icon = is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight';

    const {
        data: { derivez_accounts, dxtrade_accounts, mt5_accounts },
        is_success: is_cfd_accounts_loaded,
    } = useActiveWalletCFDAccounts();

    const active_wallet = useActiveWallet();

    const { data: all_wallets } = useWalletsList();

    const { getConfig } = useCurrencyConfig();

    const { data, ...rest } = useFetch('transfer_between_accounts', {
        payload: { accounts: 'all' },
        options: { enabled: is_cfd_accounts_loaded },
    });

    const { modified_transfer_accounts, modified_active_wallet } = useMemo(() => {
        const all_linked_cfd_accounts = [...derivez_accounts, ...dxtrade_accounts, ...mt5_accounts];

        const accounts = data?.accounts?.map(account => ({
            ...account,
            active_wallet_icon: active_wallet?.icon,
            balance: parseFloat(Number(account.balance).toFixed(getConfig(account.currency || '')?.fractional_digits)),
            display_currency_code: getConfig(account.currency || '')?.display_code,
            gradient_class: `wallet-card__${
                account?.demo_account ? 'demo' : active_wallet?.currency?.toLowerCase()
            }-bg${is_dark_mode_on ? '--dark' : ''}`,
            is_demo: Boolean(account?.demo_account),
            shortcode: active_wallet?.landing_company_name,
            type: (getConfig(account.currency || '')?.is_crypto ? 'crypto' : 'fiat') as 'fiat' | 'crypto',
        }));

        return {
            modified_transfer_accounts: {
                accounts:
                    accounts
                        ?.filter(account => account.account_type !== 'wallet')
                        .map(account => {
                            const cfd_icon = all_linked_cfd_accounts.find(
                                cfd_account => account.loginid && cfd_account.loginid?.includes(account.loginid)
                            )?.icon;

                            return {
                                ...account,
                                icon: account.account_type === 'trading' ? trading_apps_icon : cfd_icon,
                                ...(account.account_type === 'mt5' && {
                                    mt5_market_type: mt5_accounts?.find(
                                        mt5_account => account.loginid && mt5_account.loginid?.includes(account.loginid)
                                    )?.market_type,
                                }),
                            };
                        }) || [],
                wallets:
                    accounts
                        ?.filter(account => account.account_type === 'wallet')
                        .map(wallet => {
                            const wallet_icon = all_wallets?.find(
                                wallet_account => wallet_account.loginid === wallet.loginid
                            )?.icon;

                            return { ...wallet, icon: wallet_icon };
                        }) || [],
            },
            modified_active_wallet: {
                ...accounts?.find(account => account.loginid === active_wallet?.loginid),
                icon: active_wallet?.icon,
            },
        };
    }, [
        active_wallet?.currency,
        active_wallet?.icon,
        active_wallet?.landing_company_name,
        active_wallet?.loginid,
        all_wallets,
        data?.accounts,
        derivez_accounts,
        dxtrade_accounts,
        getConfig,
        is_dark_mode_on,
        mt5_accounts,
        trading_apps_icon,
    ]);

    return {
        ...rest,
        active_wallet: modified_active_wallet,
        transfer_accounts: modified_transfer_accounts,
    };
};

export default useTransferBetweenAccounts;
