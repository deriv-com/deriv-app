import { useCallback } from 'react';
import useRequest from '../useRequest';

const useDepositFiatAddress = () => {
    const { data, mutate: _mutate, ...rest } = useRequest('cashier');
    const deposit_iframe_url = typeof data?.cashier === 'string' ? data?.cashier : undefined;

    const mutate = useCallback(() => _mutate({ payload: { cashier: 'deposit', provider: 'doughflow' } }), [_mutate]);

    return {
        ...rest,
        mutate,
        data: deposit_iframe_url,
    };
};

export default useDepositFiatAddress;
