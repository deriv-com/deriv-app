import { useStore } from '@deriv/stores';
import { useServerTime } from '@deriv/api';
import dayjs from 'dayjs';
import React from 'react';
import { WS } from '@deriv/shared';

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
    const [is_request_button_diabled, setIsRequestButtonDisabled] = React.useState(false);
    // const { data: serverTime, refetch: refetchServerTime } = useServerTime();

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
                otpRequestCountdown(
                    phone_number_verification.next_email_attempt,
                    setTitle,
                    setTimer,
                    dayjs(response.time * 1000)
                );
            } else if (response.time && phone_number_verification?.next_attempt) {
                otpRequestCountdown(
                    phone_number_verification.next_attempt,
                    setTitle,
                    setTimer,
                    dayjs(response.time * 1000)
                );
            }
        });
    }, [
        phone_number_verification?.next_email_attempt,
        phone_number_verification?.next_attempt,
        is_from_request_phone_number_otp,
        setTitle,
        should_show_phone_number_otp,
    ]);

    React.useEffect(() => {
        let countdown: ReturnType<typeof setInterval>;
        if (timer && timer > 0) {
            setTitle(timer);
            countdown = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
        } else {
            setNextOtpRequest('');
        }

        return () => clearInterval(countdown);
    }, [timer, setTitle]);

    return {
        next_otp_request,
        is_request_button_diabled,
    };
};

export default usePhoneNumberVerificationSetTimer;
