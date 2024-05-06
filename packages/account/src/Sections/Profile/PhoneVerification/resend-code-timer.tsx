import React, { useRef } from 'react';
import { Button, CaptionText } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

type TResendCodeTimer = {
    resend_code_text: string;
};
const ResendCodeTimer = ({ resend_code_text }: TResendCodeTimer) => {
    // TODO: Use dynamic value for setting initial value for counter once mockApi for timestamp is finalised
    const [timer, setTimer] = React.useState(60);
    const [start_timer, setStartTimer] = React.useState(false);
    const request_code = useRef(resend_code_text);

    React.useEffect(() => {
        let countdown: ReturnType<typeof setInterval>;
        if (start_timer && timer > 0) {
            countdown = setInterval(() => {
                setTimer(prevTime => prevTime - 1);
                // TODO: change seconds to mins based on interval calculated using timestamp from mock api
                request_code.current =
                    resend_code_text === 'Resend code'
                        ? `Resend code in ${timer - 1}s`
                        : `Didn’t get the code?(${timer - 1}s)`;
            }, 1000);
        } else {
            setStartTimer(false);
            request_code.current = resend_code_text;
        }

        return () => clearInterval(countdown);
    }, [timer, start_timer]);

    const resendCode = () => {
        setTimer(60);
        setStartTimer(true);
    };

    return (
        <Button variant='tertiary' onClick={resendCode} disabled={start_timer} color='black'>
            <CaptionText bold underlined>
                <Localize i18n_default_text='{{resendCode}}' values={{ resendCode: request_code.current }} />
            </CaptionText>
        </Button>
    );
};

export default ResendCodeTimer;
