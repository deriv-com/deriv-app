import { useCallback } from 'react';
import useMutation from '../useMutation';

type TPayload = Omit<
    NonNullable<Parameters<ReturnType<typeof useMutation<'cashier'>>['mutate']>>[0]['payload'],
    'cashier' | 'provider' | 'type'
>;

/** A custom hook that used for crypto withdrawal */
const useCryptoWithdrawal = () => {
    const { mutate: _mutate, mutateAsync: _mutateAsync, ...rest } = useMutation('cashier');

    const mutate = useCallback(
        (payload: TPayload) =>
            _mutate({ payload: { cashier: 'withdraw', provider: 'crypto', type: 'api', ...payload } }),
        [_mutate]
    );
    const mutateAsync = useCallback(
        (payload: TPayload) =>
            _mutateAsync({ payload: { cashier: 'withdraw', provider: 'crypto', type: 'api', ...payload } }),
        [_mutateAsync]
    );

    return {
        /** Function to request for crypto withdrawal */
        mutate,
        mutateAsync,
        ...rest,
    };
};

export default useCryptoWithdrawal;
