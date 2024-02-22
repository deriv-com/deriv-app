import { useCallback } from 'react';
import useMutation from '../useMutation';
import useInvalidateQuery from '../useInvalidateQuery';

type TPayload = Parameters<ReturnType<typeof useMutation<'mt5_deposit'>>['mutate']>[0]['payload'];

/** A custom hook for top-up of MT5 Accounts */
const useMT5Deposit = () => {
    const invalidate = useInvalidateQuery();

    const {
        mutate: _mutate,
        mutateAsync: _mutateAsync,
        ...rest
    } = useMutation('mt5_deposit', {
        onSuccess: () => {
            invalidate('mt5_login_list');
        },
    });

    const mutate = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);
    const mutateAsync = useCallback((payload: TPayload) => _mutateAsync({ payload }), [_mutateAsync]);

    return {
        /** The mutation function that accepts a payload and sends it to the server */
        mutate,
        mutateAsync,
        ...rest,
    };
};

export default useMT5Deposit;
