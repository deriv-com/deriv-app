import { useMemo, useState, useEffect } from 'react';
import useTransferBetweenAccounts from './useTransferBetweenAccounts';

const useWalletTransfer = () => {
    const { active_wallet, transfer_accounts, isLoading: is_accounts_loading } = useTransferBetweenAccounts();

    const [from_account, setFromAccount] = useState<typeof active_wallet>();
    const [to_account, setToAccount] = useState<typeof active_wallet>();

    const to_account_list = useMemo(() => {
        if (!from_account?.loginid) return { accounts: {}, wallets: {} };
        if (!active_wallet?.loginid) return { accounts: {}, wallets: {} };

        if (from_account?.loginid === active_wallet?.loginid) {
            return {
                accounts: transfer_accounts.accounts,
                wallets: Object.fromEntries(
                    Object.entries(transfer_accounts.wallets).filter(
                        ([key]) => active_wallet?.loginid && !key.includes(active_wallet?.loginid)
                    )
                ),
            };
        }
        return { accounts: {}, wallets: { [active_wallet?.loginid]: active_wallet } };
    }, [active_wallet, from_account?.loginid, transfer_accounts]);

    //this useEffect populates from/to accounts with updated values, if they were updated in the background
    useEffect(() => {
        setFromAccount(acc => {
            return acc?.loginid
                ? { ...transfer_accounts.accounts, ...transfer_accounts.wallets }[acc?.loginid]
                : undefined;
        });
        setToAccount(acc => {
            return acc?.loginid
                ? { ...transfer_accounts.accounts, ...transfer_accounts.wallets }[acc?.loginid]
                : undefined;
        });
    }, [transfer_accounts, setFromAccount, setToAccount]);

    return {
        active_wallet,
        is_accounts_loading,
        from_account,
        to_account,
        to_account_list,
        transfer_accounts,
        setFromAccount,
        setToAccount,
    };
};

export default useWalletTransfer;
