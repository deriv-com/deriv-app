import { useState } from 'react';
import { TEmailVerificationType } from 'Types';
import useCountdown from './useCountdown';
import { useStore } from './useStore';
import useWS from './useWS';

const RESEND_COUNTDOWN = 60;

const useVerifyEmail = (type: TEmailVerificationType) => {
    const WS = useWS('verify_email');
    const counter = useCountdown({ from: RESEND_COUNTDOWN });
    const { client } = useStore();
    const [sentCount, setSentCount] = useState(0);

    const send = () => {
        if (!client.email) return;
        if (counter.isRunning) return;

        counter.reset();
        counter.start();

        setSentCount(old => old + 1);

        WS.send({ verify_email: client.email, type });
    };

    return {
        isLoading: WS.isLoading,
        error: WS.error,
        data: WS.data,
        counter: counter.count,
        isCounterRunning: counter.isRunning,
        sentCount,
        hasBeenSent: sentCount !== 0,
        send,
    };
};

export default useVerifyEmail;
