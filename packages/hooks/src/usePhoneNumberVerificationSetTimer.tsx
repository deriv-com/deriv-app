import { useStore } from '@deriv/stores';
import dayjs from 'dayjs';
import React from 'react';
import { WS } from '@deriv/shared';

/** A hook for calculating email verification otp and phone number otp timer */
const usePhoneNumberVerificationSetTimer = (is_from_request_phone_number_otp = false) => {
    const { client, ui } = useStore();
    const { account_settings } = client;
    const { should_show_phone_number_otp } = ui;
    const { phone_number_verification } = account_settings;
    const [timer, setTimer] = React.useState<number | undefined>();
    const [is_request_button_disabled, setIsRequestButtonDisabled] = React.useState(false);

    React.useEffect(() => {
        if (!phone_number_verification?.verified) {
            setIsRequestButtonDisabled(true);
            WS.send({ time: 1 }).then((response: { error?: Error; time: number }) => {
                setIsRequestButtonDisabled(false);
                if (response.error) return;

                if (
                    response.time &&
                    !should_show_phone_number_otp &&
                    !is_from_request_phone_number_otp &&
                    phone_number_verification?.next_email_attempt
                ) {
                    const request_in_milliseconds = dayjs(phone_number_verification.next_email_attempt * 1000);
                    const next_request = Math.round(request_in_milliseconds.diff(response.time * 1000) / 1000);

                    if (next_request > 0) {
                        setTimer(next_request);
                    } else {
                        setTimer(0);
                    }
                } else if (response.time && phone_number_verification?.next_attempt) {
                    const request_in_milliseconds = dayjs(phone_number_verification.next_attempt * 1000);
                    const next_request = Math.round(request_in_milliseconds.diff(response.time * 1000) / 1000);

                    if (next_request > 0) {
                        setTimer(next_request);
                    } else {
                        setTimer(0);
                    }
                }
            });
        }
    }, [
        phone_number_verification?.verified,
        phone_number_verification?.next_email_attempt,
        phone_number_verification?.next_attempt,
        is_from_request_phone_number_otp,
        should_show_phone_number_otp,
    ]);

    React.useEffect(() => {
        let countdown: ReturnType<typeof setInterval>;
        if (timer && timer > 0) {
            countdown = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
        }

        return () => clearInterval(countdown);
    }, [timer]);

    return {
        next_request_time: timer,
        is_request_button_disabled,
    };
};

export default usePhoneNumberVerificationSetTimer;
