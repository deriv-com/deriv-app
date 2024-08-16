import { useEffect, useState } from 'react';
import { WS } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import dayjs from 'dayjs';

const usePhoneNumberVerificationSessionTimer = () => {
    const [session_timer, setSessionTimer] = useState<number | undefined>();
    const [should_show_session_timeout_modal, setShouldShowSessionTimeoutModal] = useState(false);
    const { client } = useStore();
    const { account_settings } = client;
    const { phone_number_verification } = account_settings;

    useEffect(() => {
        WS.send({ time: 1 }).then((response: { error?: Error; time: number }) => {
            if (response.error) return;

            if (response.time && phone_number_verification?.session_timestamp) {
                const request_in_milliseconds = dayjs(phone_number_verification?.session_timestamp * 1000);
                const next_request = Math.round(request_in_milliseconds.diff(response.time * 1000) / 1000);

                if (next_request > 0) {
                    setSessionTimer(next_request);
                } else {
                    setSessionTimer(0);
                }
            }
        });
    }, [phone_number_verification?.session_timestamp]);

    useEffect(() => {
        let countdown: ReturnType<typeof setInterval>;
        if (typeof session_timer === 'number') {
            if (session_timer > 0) {
                setShouldShowSessionTimeoutModal(false);
                countdown = setInterval(() => {
                    setSessionTimer(session_timer - 1);
                }, 1000);
            } else {
                setShouldShowSessionTimeoutModal(true);
            }
        }
        return () => clearInterval(countdown);
    }, [session_timer]);

    return {
        should_show_session_timeout_modal,
        setShouldShowSessionTimeoutModal,
    };
};

export default usePhoneNumberVerificationSessionTimer;
