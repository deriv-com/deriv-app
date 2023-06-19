import { useCallback, useEffect } from 'react';
import { useRequest } from '@deriv/api';

const useDepositCryptoAddress = () => {
    const { data, mutate, ...rest } = useRequest('cashier');
    const deposit_address = typeof data?.cashier !== 'string' ? data?.cashier?.deposit?.address : undefined;

    const send = useCallback(
        () => mutate({ payload: { cashier: 'deposit', provider: 'crypto', type: 'api' } }),
        [mutate]
    );

    useEffect(() => {
        send();
    }, [send]);

    return {
        ...rest,
        resend: send,
        data: deposit_address,
    };
};

export default useDepositCryptoAddress;
