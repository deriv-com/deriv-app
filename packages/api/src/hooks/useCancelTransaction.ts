import { useCallback } from 'react';
import useMutation from '../useMutation';

type TPayload = Parameters<ReturnType<typeof useMutation<'cashier_withdrawal_cancel'>>['mutate']>[0]['payload'];

/** A custom hook for cancelling a cancellable pending crypto transaction (i.e., withdrawal). */
const useCancelTransaction = () => {
    const { mutate: _mutate, ...rest } = useMutation('cashier_withdrawal_cancel');

    const mutate = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);

    return {
        /** The mutation function that accepts a payload and sends it to the server */
        mutate,
        ...rest,
    };
};

export default useCancelTransaction;
