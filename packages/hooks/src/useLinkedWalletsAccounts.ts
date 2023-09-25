import { useMemo } from 'react';
import useWalletsList from './useWalletsList';

type TLinkedAccount = {
    loginid?: string;
    platform?: 'derivez' | 'dtrade' | 'dwallet' | 'dxtrade' | 'mt5';
};

type TReturnObjectType = {
    [key in Exclude<TLinkedAccount['platform'], undefined>]: TLinkedAccount[];
};

/** A custom hook to get the list of linked accounts of all wallets */
const useLinkedWalletsAccounts = () => {
    const { data: wallets_list, ...rest } = useWalletsList();

    // define object with accounts
    const linked_trading_accounts = useMemo(() => {
        const linked_accounts: TReturnObjectType = { derivez: [], dtrade: [], dwallet: [], dxtrade: [], mt5: [] };

        wallets_list?.forEach(account => {
            const linked = account.linked_to;

            linked?.forEach(linked_to_account => {
                if (linked_to_account?.platform && linked_to_account?.loginid)
                    linked_accounts[linked_to_account.platform].push(linked_to_account);
            });
        });

        return linked_accounts;
    }, [wallets_list]);

    return {
        /** List of wallets for current user. */
        data: linked_trading_accounts,
        ...rest,
    };
};

export default useLinkedWalletsAccounts;
