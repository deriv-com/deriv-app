import { useCallback, useEffect } from 'react';
import { useRequest } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useWithdrawalFiatAddress = () => {
    const { client, ui } = useStore();
    const { verification_code, setVerificationCode } = client;
    const { is_dark_mode_on } = ui;
    const { data, mutate, ...rest } = useRequest('cashier');
    const withdrawal_iframe_url =
        typeof data?.cashier === 'string' ? `${data?.cashier}&DarkMode=${is_dark_mode_on ? 'on' : 'off'}` : undefined;

    const send = useCallback(() => {
        return mutate({
            payload: {
                cashier: 'withdraw',
                provider: 'doughflow',
                verification_code: verification_code.payment_withdraw,
            },
        });
    }, [mutate]);

    useEffect(() => {
        send();
    }, [send]);

    const resetVerificationCode = () => {
        setVerificationCode('', 'payment_withdraw');
    };

    return {
        ...rest,
        resend: send,
        data: withdrawal_iframe_url,
        resetVerificationCode,
    };
};

export default useWithdrawalFiatAddress;
