import { useCallback } from 'react';
import useMutation from '../useMutation';

/** A custom hook to get the deposit crypto address. */
const useDepositCryptoAddress = () => {
    const { data, mutate: _mutate, ...rest } = useMutation('cashier');
    const deposit_address = typeof data?.cashier !== 'string' ? data?.cashier?.deposit?.address : undefined;

    const mutate = useCallback(
        () => _mutate({ payload: { cashier: 'deposit', provider: 'crypto', type: 'api' } }),
        [_mutate]
    );

    return {
        ...rest,
        mutate,
        data: deposit_address,
    };
};

export default useDepositCryptoAddress;
