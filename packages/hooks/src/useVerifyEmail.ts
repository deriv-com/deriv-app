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
    const { last_time_sent_seconds = 0, sent_count = 0 } = sent_verify_emails_data[type] || {};
    const time_now_seconds = Math.floor(Date.now() / 1000);
    const seconds_left = last_time_sent_seconds + RESEND_COUNTDOWN - time_now_seconds;
    const should_not_allow_resend =
        last_time_sent_seconds && time_now_seconds < last_time_sent_seconds + RESEND_COUNTDOWN;
    const countdown = should_not_allow_resend ? seconds_left : RESEND_COUNTDOWN;
    const counter = useCountdown({ from: countdown });

    if (!counter.is_running && should_not_allow_resend) {
        counter.start();
    }

    const send = () => {
        if (!client.email) return;
        if (counter.is_running) return;

        counter.reset();
        counter.start();
        const sent_emails_data = {
            ...sent_verify_emails_data,
            [type]: { last_time_sent_seconds: time_now_seconds, sent_count: sent_count + 1 },
        };
        setSentVerifyEmailsData(sent_emails_data);

        WS.send({ verify_email: client.email, type });
    };

    return {
        is_loading: WS.is_loading,
        error: WS.error,
        data: WS.data,
        counter: counter.count,
        is_counter_running: counter.is_running,
        sent_count,
        has_been_sent: sent_count !== 0,
        send,
    };
};

export default useVerifyEmail;
