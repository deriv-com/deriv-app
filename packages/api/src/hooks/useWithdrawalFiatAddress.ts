import { useCallback, useEffect } from 'react';
import useMutation from '../useMutation';

const useWithdrawalFiatAddress = (verification_code: string) => {
    const { data, mutate: _mutate, ...rest } = useMutation('cashier');
    const withdrawal_iframe_url = typeof data?.cashier === 'string' ? data?.cashier : undefined;

    const mutate = useCallback(() => {
        if (verification_code) {
            return _mutate({ payload: { cashier: 'withdraw', provider: 'doughflow', verification_code } });
        }
    }, [_mutate, verification_code]);

    useEffect(() => {
        if (withdrawal_iframe_url) sessionStorage.removeItem('verification_code');
    }, [withdrawal_iframe_url]);

    return {
        ...rest,
        mutate,
        data: withdrawal_iframe_url,
    };
};

export default useWithdrawalFiatAddress;
