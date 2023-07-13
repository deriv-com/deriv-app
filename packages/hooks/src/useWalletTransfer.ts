import { useEffect, useMemo, useState } from 'react';
import useTransferBetweenAccounts from './useTransferBetweenAccounts';

const useWalletTransfer = () => {
    const { active_wallet, transfer_accounts, isLoading: is_accounts_loading } = useTransferBetweenAccounts();

    const [from_account, setFromAccount] = useState<typeof active_wallet>();
    const [to_account, setToAccount] = useState<typeof active_wallet>();

    const to_account_list = useMemo(() => {
        if (from_account?.loginid === active_wallet?.loginid) {
            return {
                accounts: transfer_accounts.accounts,
                wallets: transfer_accounts.wallets?.filter(account => account.loginid !== active_wallet?.loginid),
            };
        }
        return { accounts: [], wallets: [active_wallet] };
    }, [active_wallet, from_account?.loginid, transfer_accounts]);

    //this useEffect updates transfer accounts visibility in light/dark
    useEffect(() => {
        if (from_account?.loginid)
            setFromAccount(
                [...transfer_accounts.accounts, ...transfer_accounts.wallets].find(
                    account => account.loginid === from_account.loginid
                )
            );
        if (to_account?.loginid)
            setToAccount(
                [...transfer_accounts.accounts, ...transfer_accounts.wallets].find(
                    account => account.loginid === to_account.loginid
                )
            );
    }, [from_account?.loginid, setFromAccount, setToAccount, to_account?.loginid, transfer_accounts]);

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
