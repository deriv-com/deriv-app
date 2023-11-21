import { useMemo } from 'react';
import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

/** A custom hook that gets the list of available wallets. */
const useAvailableWallets = () => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('available_accounts', {
        payload: {
            categories: ['wallet'],
        },
        options: {
            enabled: isSuccess,
        },
    });

    const modifiedData = useMemo(() => {
        if (!data?.available_accounts?.wallets) return;

        return data.available_accounts.wallets;
    }, [data]);

    return {
        /** List of available wallet accounts to create */
        data: modifiedData,
        ...rest,
    };
};

export default useAvailableWallets;
