import { useState } from 'react';
import { useWS } from '@deriv/api';
import type { TSocketEndpoints } from '@deriv/api/types';
import { useStore } from '@deriv/stores';
import useCountdown from './useCountdown';

const RESEND_COUNTDOWN = 60;

export type TEmailVerificationType = TSocketEndpoints['verify_email']['request']['type'];

const useVerifyEmail = (type: TEmailVerificationType) => {
    const WS = useWS('verify_email');
    const counter = useCountdown({ from: RESEND_COUNTDOWN });
    const { client } = useStore();
    const [sent_count, setSentCount] = useState(0);

    const send = () => {
        if (!client.email) return;
        if (counter.is_running) return;

        counter.reset();
        counter.start();

        setSentCount(old => old + 1);

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
