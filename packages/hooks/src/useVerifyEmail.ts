import React from 'react';
import { useWS } from '@deriv/api';
import { useStore } from '@deriv/stores';
import type { TSocketEndpoints } from '@deriv/api/types';
import useCountdown from './useCountdown';

const RESEND_COUNTDOWN = 60;

export type TEmailVerificationType = TSocketEndpoints['verify_email']['request']['type'];

const useVerifyEmail = (type: TEmailVerificationType) => {
    const WS = useWS('verify_email');
    const { client } = useStore();
    const { setSentVerifyEmailsData, sent_verify_emails_data } = client;
    const { resend_email_requested_time = 0, sent_count: current_sent_count = 0 } =
        sent_verify_emails_data?.[type] || {};
    const [sent_count, setSentCount] = React.useState(current_sent_count);
    const time_now_seconds = Math.floor(Date.now() / 1000);
    const seconds_left = resend_email_requested_time + RESEND_COUNTDOWN - time_now_seconds;
    const should_not_allow_resend =
        resend_email_requested_time && time_now_seconds < resend_email_requested_time + RESEND_COUNTDOWN;
    const countdown = should_not_allow_resend ? seconds_left : RESEND_COUNTDOWN;
    const { count, is_running, reset, start } = useCountdown({ from: countdown });

    if (!is_running && should_not_allow_resend) {
        start();
    } else if (
        !should_not_allow_resend &&
        count === RESEND_COUNTDOWN &&
        resend_email_requested_time &&
        sent_count > 0
    ) {
        if (is_running) reset();
        setSentVerifyEmailsData({ ...sent_verify_emails_data, [type]: {} });
        setSentCount(0);
    }

    const send = () => {
        if (!client.email || is_running) return;

        if (sent_count > 0) {
            reset();
            start();
        }

        const sent_emails_data = {
            ...sent_verify_emails_data,
            [type]: {
                resend_email_requested_time: sent_count && time_now_seconds,
                sent_count: sent_count + 1,
            },
        };
        setSentVerifyEmailsData(sent_emails_data);
        setSentCount(sent_count + 1);

        WS.send({ verify_email: client.email, type });
    };

    return {
        is_loading: WS.is_loading,
        error: WS.error,
        data: WS.data,
        counter: count,
        is_counter_running: is_running,
        sent_count,
        has_been_sent: sent_count !== 0,
        send,
    };
};

export default useVerifyEmail;
