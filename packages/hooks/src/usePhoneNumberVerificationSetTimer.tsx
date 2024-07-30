import { useStore } from '@deriv/stores';
import { useServerTime } from '@deriv/api';
import dayjs from 'dayjs';
import React from 'react';

const otpRequestCountdown = (
    nextAttemptTimestamp: number,
    setTitle: (title: number) => void,
    setTimer: (title: number) => void,
    current_time: dayjs.Dayjs
) => {
    const request_in_milliseconds = dayjs(nextAttemptTimestamp * 1000);
    const next_request = Math.round(request_in_milliseconds.diff(current_time) / 1000);

    if (next_request > 0) {
        setTitle(next_request);
        setTimer(next_request);
    }
};

/** A hook for calculating email verification otp and phone number otp timer */
const usePhoneNumberVerificationSetTimer = (is_from_request_phone_number_otp = false) => {
    const { client, ui } = useStore();
    const { account_settings } = client;
    const { should_show_phone_number_otp } = ui;
    const { phone_number_verification } = account_settings;
    const [timer, setTimer] = React.useState<number | undefined>();
    const [next_otp_request, setNextOtpRequest] = React.useState('');
    const { data: serverTime } = useServerTime();

    const setTitle = React.useCallback(
        (timer: number) => {
            let display_time: string;
            if (timer > 60) {
                display_time = is_from_request_phone_number_otp
                    ? `${Math.round(timer / 60)} minutes`
                    : `${Math.round(timer / 60)}m`;
            } else {
                display_time = is_from_request_phone_number_otp ? `${timer} seconds` : `${timer}s`;
            }
            if (is_from_request_phone_number_otp) {
                setNextOtpRequest(` ${display_time}`);
            } else if (should_show_phone_number_otp) {
                setNextOtpRequest(` (${display_time})`);
            } else {
                setNextOtpRequest(` in ${display_time}`);
            }
        },
        [should_show_phone_number_otp, is_from_request_phone_number_otp]
    );

    React.useEffect(() => {
        if (
            serverTime?.time &&
            !should_show_phone_number_otp &&
            !is_from_request_phone_number_otp &&
            phone_number_verification?.next_email_attempt
        ) {
            otpRequestCountdown(
                phone_number_verification.next_email_attempt,
                setTitle,
                setTimer,
                dayjs(serverTime?.time * 1000)
            );
        } else if (serverTime?.time && phone_number_verification?.next_attempt) {
            otpRequestCountdown(
                phone_number_verification.next_attempt,
                setTitle,
                setTimer,
                dayjs(serverTime?.time * 1000)
            );
        }
    }, [
        serverTime,
        phone_number_verification?.next_email_attempt,
        phone_number_verification?.next_attempt,
        is_from_request_phone_number_otp,
        setTitle,
        should_show_phone_number_otp,
    ]);

    React.useEffect(() => {
        let countdown: ReturnType<typeof setInterval>;
        if (timer && timer > 0) {
            countdown = setInterval(() => {
                setTimer(timer - 1);
                setTitle(timer);
            }, 1000);
        } else {
            setNextOtpRequest('');
        }

        return () => clearInterval(countdown);
    }, [timer, setTitle]);

    return {
        next_otp_request,
    };
};

export default usePhoneNumberVerificationSetTimer;
