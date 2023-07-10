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
                gradient_class: `wallet-card__${
                    account?.demo_account ? 'demo' : active_wallet?.currency?.toLowerCase()
                }-bg${is_dark_mode_on ? '--dark' : ''}`,
                is_demo: Boolean(account?.demo_account),
                shortcode: active_wallet?.landing_company_name,
                type: getAccountType(account.demo_account, account.currency),
            };
        });

        return {
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
        };
    }, [
        active_wallet?.currency,
        active_wallet?.icon,
        active_wallet?.landing_company_name,
        all_wallets,
        data?.accounts,
        derivez_accounts,
        dxtrade_accounts,
        getConfig,
        is_dark_mode_on,
        mt5_accounts,
        trading_apps_icon,
    ]);

    const modified_active_wallet = useMemo(
        () => ({
            ...modified_transfer_accounts.wallets?.find(wallet => wallet.loginid === active_wallet?.loginid),
            icon: active_wallet?.icon,
        }),
        [active_wallet?.icon, active_wallet?.loginid, modified_transfer_accounts.wallets]
    );

    //add test accounts, remove after tsesting
    const test_accounts = modified_transfer_accounts.accounts.concat([
        {
            account_type: 'dxtrade',
            balance: 1000,
            currency: 'USD',
            demo_account: 1,
            loginid: 'DXR1009',
            market_type: 'all',
            active_wallet_icon: 'IcWalletDerivDemoLight',
            display_currency_code: 'USD',
            gradient_class: 'wallet-card__demo-bg',
            is_demo: true,
            shortcode: 'svg',
            type: 'demo',
            icon: 'IcRebrandingDerivX',
        },
        {
            account_type: 'derivez',
            balance: 1000,
            currency: 'USD',
            demo_account: 1,
            derivez_group: 'real\\p02_ts01\\all\\svg_ez_usd',
            loginid: 'EZR80001086',
            status: null,
            active_wallet_icon: 'IcWalletDerivDemoLight',
            display_currency_code: 'USD',
            gradient_class: 'wallet-card__demo-bg',
            is_demo: true,
            shortcode: 'svg',
            type: 'demo',
            icon: 'IcRebrandingDerivEz',
        },
    ]);

    return {
        ...rest,
        active_wallet: modified_active_wallet,
        transfer_accounts: { ...modified_transfer_accounts, accounts: test_accounts },
    };
};

export default useTransferBetweenAccounts;
