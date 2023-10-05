import { useCallback, useEffect } from 'react';
import { useRequest } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useWithdrawalFiatAddress = () => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;
    const { data, mutate, ...rest } = useRequest('cashier');
    const withdrawal_iframe_url =
        typeof data?.cashier === 'string' ? `${data?.cashier}&DarkMode=${is_dark_mode_on ? 'on' : 'off'}` : undefined;

    const send = useCallback(() => mutate({ payload: { cashier: 'withdraw', provider: 'doughflow' } }), [mutate]);

    useEffect(() => {
        send();
    }, [send]);

    return {
        ...rest,
        resend: send,
        data: withdrawal_iframe_url,
    };
};

export default useWithdrawalFiatAddress;
