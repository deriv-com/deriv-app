import { useMemo, useState, useEffect } from 'react';
import useTransferBetweenAccounts from './useTransferBetweenAccounts';

const useWalletTransfer = () => {
    const {
        active_wallet,
        transfer_trading_accounts,
        transfer_wallets,
        isLoading: is_accounts_loading,
    } = useTransferBetweenAccounts();

    const [from_account, setFromAccount] = useState<typeof active_wallet>();
    const [to_account, setToAccount] = useState<typeof active_wallet>();

    const to_account_list = useMemo(() => {
        if (!from_account?.loginid) return { trading_accounts: {}, wallets: {} };
        if (!active_wallet?.loginid) return { trading_accounts: {}, wallets: {} };

        if (from_account?.loginid === active_wallet?.loginid) {
            return {
                trading_accounts: transfer_trading_accounts,
                wallets: Object.fromEntries(
                    Object.entries(transfer_wallets).filter(
                        ([key]) => active_wallet?.loginid && !key.includes(active_wallet?.loginid)
                    )
                ),
            };
        }
        return { trading_accounts: {}, wallets: { [active_wallet?.loginid]: active_wallet } };
    }, [active_wallet, from_account?.loginid, transfer_trading_accounts, transfer_wallets]);

    //this useEffect populates from/to accounts with updated values, if they were updated in the background
    useEffect(() => {
        setFromAccount(acc => {
            return acc?.loginid ? { ...transfer_trading_accounts, ...transfer_wallets }[acc?.loginid] : undefined;
        });
        setToAccount(acc => {
            return acc?.loginid ? { ...transfer_trading_accounts, ...transfer_wallets }[acc?.loginid] : undefined;
        });
    }, [setFromAccount, setToAccount, transfer_trading_accounts, transfer_wallets]);

    return {
        active_wallet,
        is_accounts_loading,
        from_account,
        to_account,
        to_account_list,
        transfer_accounts: { trading_accounts: transfer_trading_accounts, wallets: transfer_wallets },
        setFromAccount,
        setToAccount,
    };
};

export default useWalletTransfer;
