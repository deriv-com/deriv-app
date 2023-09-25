import { useMemo } from 'react';
import useWalletsList from './useWalletsList';

/** A custom hook that returns the wallet object for the current active wallet. */
const useActiveWallet = () => {
    const { data } = useWalletsList();
    const active_wallet = useMemo(() => data?.find(wallet => wallet.is_selected), [data]);

    /** User's current active wallet. */
    return active_wallet;
};

export default useActiveWallet;
