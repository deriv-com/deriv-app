import { useMemo, useState, useEffect } from 'react';
import useTransferBetweenAccounts from './useTransferBetweenAccounts';

const useWalletTransfer = () => {
    const {
        active_wallet,
        trading_accounts,
        wallet_accounts,
        isLoading: is_accounts_loading,
    } = useTransferBetweenAccounts();

    const [from_account, setFromAccount] = useState<typeof active_wallet>();
    const [to_account, setToAccount] = useState<typeof active_wallet>();

    const to_account_list = useMemo(() => {
        if (!from_account?.loginid) return { trading_accounts: {}, wallet_accounts: {} };
        if (!active_wallet?.loginid) return { trading_accounts: {}, wallet_accounts: {} };

        if (from_account?.loginid === active_wallet?.loginid) {
            return {
                trading_accounts,
                wallet_accounts: Object.fromEntries(
                    Object.entries(wallet_accounts).filter(
                        ([key]) => active_wallet?.loginid && !key.includes(active_wallet?.loginid)
                    )
                ),
            };
        }
        return { trading_accounts: {}, wallet_accounts: { [active_wallet?.loginid]: active_wallet } };
    }, [active_wallet, from_account?.loginid, trading_accounts, wallet_accounts]);

    //this useEffect populates from/to accounts with updated values, if they were updated in the background
    useEffect(() => {
        setFromAccount(acc => {
            return acc?.loginid ? { ...trading_accounts, ...wallet_accounts }[acc?.loginid] : undefined;
        });
        setToAccount(acc => {
            return acc?.loginid ? { ...trading_accounts, ...wallet_accounts }[acc?.loginid] : undefined;
        });
    }, [setFromAccount, setToAccount, trading_accounts, wallet_accounts]);

    return {
        active_wallet,
        is_accounts_loading,
        from_account,
        to_account,
        to_account_list,
        transfer_accounts: { trading_accounts, wallet_accounts },
        setFromAccount,
        setToAccount,
    };
};

export default useWalletTransfer;
