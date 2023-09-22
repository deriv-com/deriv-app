import { useCallback } from 'react';
import useRequest from '../useRequest';

const useDepositCryptoAddress = () => {
    const { data, mutate: _mutate, ...rest } = useRequest('cashier');
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
