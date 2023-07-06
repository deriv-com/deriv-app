import { useMemo } from 'react';
import { useStore } from '@deriv/stores';
import { useFetch } from '@deriv/api';
import useActiveWallet from './useActiveWallet';
import useActiveWalletCFDAccounts from './useActiveWalletCFDAccounts';
import useCurrencyConfig from './useCurrencyConfig';

const useTransferBetweenAccounts = () => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;

    const { data: linked_cfd_accounts, is_success: is_cfd_accounts_loaded } = useActiveWalletCFDAccounts();

    const active_wallet = useActiveWallet();

    const { getConfig } = useCurrencyConfig();

    const { data, ...rest } = useFetch('transfer_between_accounts', {
        payload: { accounts: 'all' },
        options: { enabled: is_cfd_accounts_loaded },
    });

    const { modified_transfer_accounts, modified_active_wallet } = useMemo(() => {
        const accounts = data?.accounts?.map(
            account =>
                ({
                    account_type: account.account_type,
                    balance:
                        parseFloat(
                            Number(account.balance).toFixed(getConfig(account.currency || '')?.fractional_digits)
                        ) || 0,
                    currency: account.currency || '',
                    display_currency_code: getConfig(account.currency || '')?.display_code,
                    gradient_class: `wallet-card__${
                        account?.demo_account ? 'demo' : account.currency?.toLowerCase()
                    }-bg${is_dark_mode_on ? '--dark' : ''}` as string,
                    is_demo: Boolean(account?.demo_account),
                    loginid: account?.loginid || '',
                    mt5_market_type: linked_cfd_accounts.mt5_accounts?.find(
                        mt5_account => account.loginid && mt5_account.login?.includes(account.loginid)
                    )?.market_type,
                    shortcode: active_wallet?.landing_company_name,
                    type: getConfig(account.currency || '')?.is_crypto ? 'crypto' : 'fiat',
                    wallet_icon: active_wallet?.icon,
                } as const)
        );

        return {
            modified_transfer_accounts: {
                accounts: accounts?.filter(account => account.account_type !== 'wallet') || [],
                wallets: accounts?.filter(account => account.account_type === 'wallet') || [],
            },
            modified_active_wallet: accounts?.find(account => account.loginid === active_wallet?.loginid),
        };
    }, [active_wallet, data?.accounts, getConfig, is_dark_mode_on]);

    return {
        ...rest,
        active_wallet: modified_active_wallet,
        transfer_accounts: modified_transfer_accounts,
    };
};

export default useTransferBetweenAccounts;
