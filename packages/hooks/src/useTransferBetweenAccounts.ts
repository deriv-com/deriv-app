import { useEffect, useMemo } from 'react';
import { useStore } from '@deriv/stores';
import { useRequest } from '@deriv/api';
import useActiveWallet from './useActiveWallet';
import useCurrencyConfig from './useCurrencyConfig';

const useTransferBetweenAccounts = () => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;

    const active_wallet = useActiveWallet();

    const { getConfig } = useCurrencyConfig();

    const { data, mutate, ...rest } = useRequest('transfer_between_accounts');

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
                    //fix display balance
                    // display_balance: '0',
                    gradient_class: `wallet-card__${
                        account?.demo_account ? 'demo' : account.currency?.toLowerCase()
                    }-bg${is_dark_mode_on ? '--dark' : ''}` as string,
                    //TODO: fix icon
                    // icon: (account.account_type !== 'wallet' ? 'IcDxtradeDerived' : '') as string,
                    is_demo: account?.demo_account,
                    //TODO: fix jurisdiction
                    jurisdiction: account.demo_account ? 'demo' : 'svg',
                    //fix label
                    // label: '',
                    loginid: account?.loginid || '',
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
    }, [active_wallet?.icon, active_wallet?.loginid, data?.accounts, getConfig, is_dark_mode_on]);

    useEffect(() => {
        mutate({ payload: { accounts: 'all' } });
    }, [mutate]);

    return {
        ...rest,
        active_wallet: modified_active_wallet,
        transfer_accounts: modified_transfer_accounts,
        mutate,
    };
};

export default useTransferBetweenAccounts;
