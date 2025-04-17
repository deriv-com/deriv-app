import { useCallback, useEffect } from 'react';

import { useRequest } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useDepositFiatAddress = () => {
    const { common, ui } = useStore();
    const { current_language } = common;
    const { is_dark_mode_on } = ui;
    const { data, mutate, ...rest } = useRequest('cashier');
    const dark_mode = is_dark_mode_on ? 'on' : 'off';

    let deposit_iframe_url;
    if (typeof data?.cashier === 'string') {
        const cashierUrl = new URL(data.cashier);
        cashierUrl.searchParams.set('DarkMode', dark_mode);
        deposit_iframe_url = cashierUrl.toString();
    }

    const send = useCallback(() => mutate({ payload: { cashier: 'deposit', provider: 'doughflow' } }), [mutate]);

    useEffect(() => {
        send();
    }, [send, current_language]);

    return {
        ...rest,
        resend: send,
        data: deposit_iframe_url,
    };
};

export default useDepositFiatAddress;
