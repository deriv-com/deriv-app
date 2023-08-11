import { useMemo } from 'react';
import useWalletAccountsList from './useWalletAccountsList';

/** A custom hook that returns the wallet object for the current active wallet. */
const useActiveWallet = () => {
    const { data } = useWalletAccountsList();
    const active_wallet = useMemo(() => {
        const wallet = data?.find(wallet => wallet.is_active);
        // added next string because useWalletAccountsList doesn't have is_demo and is_selected
        // should be deleted during refactor
        // TODO: change all is_demo to is_virtaul and is_selected for is_active in UI
        return wallet ? { ...wallet, is_demo: wallet.is_virtual, is_selected: wallet.is_active } : wallet;
    }, [data]);

    /** User's current active wallet. */
    return active_wallet;
};

export default useActiveWallet;
