import React, { useEffect, useMemo, useState } from 'react';
import { useRequest } from '@deriv/api';
import { Badge } from '@deriv/components';
import { getDecimalPlaces, formatMoney } from '@deriv/shared';
import { localize } from '../../translations/src/i18next/i18next';
import useActiveWallet from './useActiveWallet';
import useCurrencyConfig from './useCurrencyConfig';

type TJurisdiction = 'svg' | 'malta' | 'demo';

const getJurisdictionBadge = (jurisdiction: TJurisdiction) => {
    return jurisdiction === 'demo' ? (
        <Badge label={localize('Demo')} type='contained' background_color='blue' />
    ) : (
        <Badge label={jurisdiction.toUpperCase()} type='bordered' />
    );
};

const getAccountLabel = (
    account_type: NonNullable<ReturnType<typeof useActiveWallet>>['account_type'],
    is_demo?: number,
    display_code?: NonNullable<ReturnType<ReturnType<typeof useCurrencyConfig>['getConfig']>>['display_code']
) => {
    switch (account_type) {
        case 'trading':
            return is_demo ? 'Deriv Apps' : '';
        case 'wallet':
            return `${is_demo ? localize('Demo') : ''} ${display_code} ${localize('Wallet')}`;
        default:
            return '';
    }
};

const useTransferBetweenAccounts = () => {
    const active_wallet_loginid = useActiveWallet()?.loginid;

    const { getConfig } = useCurrencyConfig();

    const { data, mutate, ...rest } = useRequest('transfer_between_accounts');

    const { modified_transfer_accounts, modified_active_wallet } = useMemo(() => {
        const accounts = data?.accounts?.map(
            account =>
                ({
                    account_type: account.account_type,
                    balance:
                        parseFloat(Number(account.balance).toFixed(getDecimalPlaces(account?.currency || ''))) || 0,
                    currency: account.currency || '',
                    display_balance: formatMoney(account.currency || '', account.balance || 0, true),
                    //TODO: fix icon
                    icon: (account.account_type !== 'wallet' ? 'IcDxtradeDerived' : '') as string,
                    is_demo: account?.demo_account,
                    jurisdiction: getJurisdictionBadge(account.demo_account ? 'demo' : 'svg'),
                    label: getAccountLabel(
                        account.account_type,
                        account.demo_account,
                        getConfig(account.currency || '')?.display_code
                    ),
                    loginid: account?.loginid || '',
                    //TODO: fix jurisdiction
                    type: getConfig(account.currency || '')?.is_crypto ? 'crypto' : 'fiat',
                    //TODO: replace with proper wallet icon
                    wallet_icon: 'IcCurrencyUsd' as string,
                } as const)
        );

        return {
            modified_transfer_accounts: {
                accounts: accounts?.filter(account => account.account_type !== 'wallet') || [],
                wallets: accounts?.filter(account => account.account_type === 'wallet') || [],
            },
            modified_active_wallet: accounts?.find(account => account.loginid === active_wallet_loginid),
        };
    }, [active_wallet_loginid, data?.accounts, getConfig]);

    const [from_account, setFromAccount] = useState<typeof modified_active_wallet>();
    const [to_account, setToAccount] = useState<typeof modified_active_wallet>();
    const [is_loading, setIsLoading] = useState(true);

    const to_account_list = useMemo(() => {
        if (from_account?.label === modified_active_wallet?.label) {
            setToAccount(undefined);
            return {
                accounts: modified_transfer_accounts.accounts,
                wallets: modified_transfer_accounts.wallets?.filter(
                    account => account.loginid !== modified_active_wallet?.loginid
                ),
            };
        }
        setToAccount(modified_active_wallet);
        return { accounts: [], wallets: [modified_active_wallet] };
    }, [from_account?.label, modified_active_wallet, modified_transfer_accounts]);

    useEffect(() => {
        if (modified_active_wallet) {
            setFromAccount(modified_active_wallet);
            setIsLoading(false);
        }
    }, [modified_active_wallet]);

    useEffect(() => {
        mutate({ payload: { accounts: 'all' } });
    }, [mutate]);

    return {
        active_wallet: modified_active_wallet,
        is_loading: is_loading || !rest.isSuccess,
        from_account,
        to_account,
        to_account_list,
        transfer_accounts: modified_transfer_accounts,
        //TODO: return requestTransfer instead of mutate
        mutate,
        setFromAccount,
        setToAccount,
    };
};

export default useTransferBetweenAccounts;
