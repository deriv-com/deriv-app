import React, { useRef } from 'react';
import { Button, CaptionText } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

type TResendCodeTimer = {
    resend_code_text: string;
    count_from: number;
};
const ResendCodeTimer = ({ count_from = 60, resend_code_text }: TResendCodeTimer) => {
    // TODO: Use dynamic value for setting initial value for counter once mockApi for timestamp is finalised
    const [timer, setTimer] = React.useState(count_from);
    const [start_timer, setStartTimer] = React.useState(true);
    // TODO: change seconds to mins based on interval calculated using timestamp from mock api
    const initial_timer_title =
        resend_code_text === 'Resend code' ? `Resend code in ${timer}s` : `Didn’t get the code?(${timer}s)`;
    const [timer_title, setTimerTitle] = React.useState(initial_timer_title);

    const setTitle = (timer: number, text: string) => {
        const title = text === 'Resend code' ? `Resend code in ${timer}s` : `Didn’t get the code?(${timer}s)`;
        setTimerTitle(title);
    };

    React.useEffect(() => {
        let countdown: ReturnType<typeof setInterval>;
        if (start_timer && timer > 0) {
            countdown = setInterval(() => {
                setTimer(prevTime => prevTime - 1);
                setTitle(timer, resend_code_text);
            }, 1000);
        } else {
            setStartTimer(false);
            setTimerTitle(resend_code_text);
        }

        return () => clearInterval(countdown);
    }, [timer, start_timer]);

    const resendCode = () => {
        setTimer(count_from);
        setStartTimer(true);
    };

    return (
        <Button variant='tertiary' onClick={resendCode} disabled={start_timer} color='black'>
            <CaptionText bold underlined>
                <Localize i18n_default_text='{{resendCode}}' values={{ resendCode: timer_title }} />
            </CaptionText>
        </Button>
    );
};

export default ResendCodeTimer;
