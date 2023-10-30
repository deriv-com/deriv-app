import { useCallback } from 'react';
import useMutation from '../useMutation';

/** A custom hook to get the withdrawal fiat address. */
const useWithdrawalFiatAddress = () => {
    const { data, mutate: _mutate, ...rest } = useMutation('cashier');
    const withdrawal_iframe_url = typeof data?.cashier === 'string' ? data?.cashier : undefined;

    const mutate = useCallback(
        () => _mutate({ payload: { cashier: 'withdraw', provider: 'doughflow', verification_code: '' } }),
        [_mutate]
    );

    return {
        ...rest,
        mutate,
        data: withdrawal_iframe_url,
    };
};

export default useWithdrawalFiatAddress;
