import { useMemo } from 'react';
import useWalletAccountsList from './useWalletAccountsList';

/** A custom hook that returns the wallet object for the current active wallet. */
const useActiveWalletAccount = () => {
    const { data, ...rest } = useWalletAccountsList();
    const active_wallet = useMemo(() => data?.find(wallet => wallet.is_active), [data]);

    return {
        /** User's current active wallet. */
        data: active_wallet,
        ...rest,
    };
};

export default useActiveWalletAccount;
