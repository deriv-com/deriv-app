import { useCallback, useEffect } from 'react';
import { useMutation } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useWithdrawalFiatAddress = () => {
    const { client, ui } = useStore();
    const { verification_code, setVerificationCode } = client;
    const { is_dark_mode_on } = ui;
    const { data, mutate, ...rest } = useMutation('cashier');
    const withdrawal_iframe_url =
        typeof data?.cashier === 'string' ? `${data?.cashier}&DarkMode=${is_dark_mode_on ? 'on' : 'off'}` : undefined;

    const send = useCallback(
        () =>
            mutate({
                payload: {
                    cashier: 'withdraw',
                    provider: 'doughflow',
                    verification_code: verification_code.payment_withdraw,
                },
            }),
        [mutate]
    );

    useEffect(() => {
        // Send the request for getting the iframe_url only when we have the verification_code and the data received from useMutation is undefined.
        // This is done to prevent the API call to happen for crypto_withdrawal in which case it throws 'Input_Validation` error.
        if (verification_code.payment_withdraw !== '' && !withdrawal_iframe_url) {
            send();
        }
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
