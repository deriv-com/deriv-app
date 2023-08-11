import { useCallback, useEffect } from 'react';
import { useRequest } from '@deriv/api';

const useDepositFiatAddress = () => {
    const { data, mutate, ...rest } = useRequest('cashier');
    const deposit_iframe_url = typeof data?.cashier === 'string' ? `${data?.cashier}&DarkMode=off` : undefined;

    const send = useCallback(() => mutate({ payload: { cashier: 'deposit', provider: 'doughflow' } }), [mutate]);

    useEffect(() => {
        send();
    }, [send]);

    return {
        ...rest,
        resend: send,
        data: deposit_iframe_url,
    };
};

export default useDepositFiatAddress;
