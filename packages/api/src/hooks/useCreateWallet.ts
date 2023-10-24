import { useMemo } from 'react';
import useInvalidateQuery from '../useInvalidateQuery';
import useMutation from '../useMutation';

/** A custom hook to create new wallet account */
const useCreateWallet = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useMutation('new_account_wallet', {
        onSuccess: () => invalidate('authorize'),
    });

    const mutate = (params: Parameters<typeof _mutate>[0]['payload']) => {
        return _mutate({ payload: params });
    };

    const modified_data = useMemo(() => {
        if (!data?.new_account_wallet) return;

        return data.new_account_wallet;
    }, [data?.new_account_wallet]);

    return {
        /** New account information */
        data: modified_data,
        /** A function to create new wallet */
        mutate,
        ...rest,
    };
};

export default useCreateWallet;
