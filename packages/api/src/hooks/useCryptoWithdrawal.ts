import { useCallback } from 'react';
import useMutation from '../useMutation';

type TPayload = Omit<
    NonNullable<Parameters<ReturnType<typeof useMutation<'cashier'>>['mutate']>>[0]['payload'],
    'cashier' | 'provider' | 'type'
>;

/** A custom hook that used for crypto withdrawal */
const useCryptoWithdrawal = () => {
    const { mutate: _mutate, ...rest } = useMutation('cashier');

    const mutate = useCallback(
        (payload: TPayload) =>
            _mutate({ payload: { cashier: 'withdraw', provider: 'crypto', type: 'api', ...payload } }),
        [_mutate]
    );

    return {
        /** Function to request for crypto withdrawal */
        mutate,
        ...rest,
    };
};

export default useCryptoWithdrawal;
