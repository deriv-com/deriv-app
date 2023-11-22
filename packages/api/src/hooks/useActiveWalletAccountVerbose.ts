import { useMemo } from 'react';
import useActiveWalletAccount from './useActiveWalletAccount';
import useMT5AccountsList from './useMT5AccountsList';
import useWalletAccountsList from './useWalletAccountsList';
import useDxtradeAccountsList from './useDxtradeAccountsList';

/** A custom hook that returns the wallet object for the current active wallet, containing `transfer_options` list. */
const useActiveWalletAccountVerbose = () => {
    const { data: wallet, isError: isWalletError, isLoading: isWalletLoading, ...rest } = useActiveWalletAccount();
    const { data: walletList, isError: isWalletListError, isLoading: isWalletListLoading } = useWalletAccountsList();
    const {
        data: mt5List,
        isError: isMT5AccountsListError,
        isLoading: isMT5AccountsListLoading,
    } = useMT5AccountsList();
    const { data: dxtradeList, isError: isDxtradeError, isLoading: isDxtradeLoading } = useDxtradeAccountsList();

    const dtrade = useMemo(
        () => wallet?.linked_to?.filter(account => account.platform === 'dtrade'),
        [wallet?.linked_to]
    );

    const dxtrade = useMemo(
        () =>
            wallet?.linked_to
                ?.filter(account => account.platform === 'dxtrade')
                .map(account => ({ ...account, ...dxtradeList?.find(acc => acc.login === account.loginid) })),
        [dxtradeList, wallet?.linked_to]
    );

    const mt5 = useMemo(
        () =>
            wallet?.linked_to
                ?.filter(account => account.platform === 'mt5')
                .map(account => ({
                    ...account,
                    ...mt5List?.find(acc => acc.loginid === account.loginid),
                })),
        [mt5List, wallet?.linked_to]
    );

    return {
        /** User's current active wallet. */
        data: {
            ...wallet,
            transfer_options: { dtrade, dxtrade, mt5, wallets: walletList },
        },
        isError: isWalletError || isWalletListError || isMT5AccountsListError || isDxtradeError,
        isLoading: isWalletLoading || isWalletListLoading || isMT5AccountsListLoading || isDxtradeLoading,
        ...rest,
    };
};

export default useActiveWalletAccountVerbose;
