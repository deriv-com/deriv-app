import { useCallback, useEffect } from 'react';
import { useRequest } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useWithdrawalFiatAddress = () => {
    const { client } = useStore();
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;
    const { data, mutate, ...rest } = useRequest('cashier');
    const withdrawal_address =
        typeof data?.cashier === 'string' ? `${data?.cashier}&DarkMode=${is_dark_mode_on ? 'on' : 'off'}` : undefined;

    useEffect(() => {
        if (withdrawal_address === 'string') {
            client.setVerificationCode('', 'withdraw');
        }
    }, [withdrawal_address]);

    const send = useCallback(() => {
        if (client.verification_code.payment_withdraw)
            mutate({
                payload: {
                    cashier: 'withdraw',
                    provider: 'doughflow',
                    verification_code: client.verification_code.payment_withdraw,
                },
            });
    }, [mutate]);

    useEffect(() => {
        send();
    }, [send]);

    return {
        ...rest,
        resend: send,
        data: withdrawal_address,
    };
};

export default useWithdrawalFiatAddress;
