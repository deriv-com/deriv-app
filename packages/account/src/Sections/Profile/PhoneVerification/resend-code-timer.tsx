import React, { useRef } from 'react';
import { Button, CaptionText } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

const ResendCodeTimer = () => {
    const [timer, setTimer] = React.useState(60);
    const [startTimer, setStartTimer] = React.useState(false);
    const resendCodeText = useRef('Resend code');

    React.useEffect(() => {
        let countdown: NodeJS.Timeout;
        if (startTimer && timer > 0) {
            countdown = setInterval(() => {
                setTimer(prevTime => prevTime - 1);
                resendCodeText.current = `Resend code in ${timer - 1}s`;
            }, 1000);
        } else {
            setStartTimer(false);
            resendCodeText.current = 'Resend code';
        }

        return () => clearInterval(countdown);
    }, [timer, startTimer]);

    const resendCode = () => {
        setTimer(60);
        setStartTimer(true);
    };

    return (
        <Button variant='tertiary' onClick={resendCode} disabled={startTimer} color='black'>
            <CaptionText bold underlined>
                <Localize i18n_default_text='{{resendCode}}' values={{ resendCode: resendCodeText.current }} />
            </CaptionText>
        </Button>
    );
};

export default ResendCodeTimer;
