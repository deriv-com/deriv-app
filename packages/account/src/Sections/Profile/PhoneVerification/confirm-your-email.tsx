import React, { useRef } from 'react';
import PhoneVerificationCard from './phone-verification-card';
import { CaptionText, Text } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { Input } from '@deriv/components';

const ConfirmYourEmail = observer(() => {
    const [timer, setTimer] = React.useState(60);
    const [startTimer, setStartTimer] = React.useState(false);

    const { client } = useStore();
    const { account_settings } = client;
    const { email } = account_settings;

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
        <PhoneVerificationCard is_small_card>
            <Text bold>
                <Localize i18n_default_text="Confirm it's you" />
            </Text>
            <div className='phone-verification__card--email-verification-content'>
                <Text size='sm'>
                    <Localize
                        i18n_default_text="We've sent a verification code to <0>{{users_email}}</0>."
                        values={{ users_email: email }}
                        components={[<strong key={0} />]}
                    />
                </Text>
                <Text size='sm'>
                    <Localize i18n_default_text='Enter the code or click the link in the email to verify that the account belongs to you.' />
                </Text>
            </div>
            <div className='phone-verification__card--email-verification-otp-container'>
                <Input id='otp_code' type='text' name='otp_code' label={localize('OTP code')} data-lpignore='true' />
                <CaptionText bold underlined onClick={resendCode}>
                    <Localize i18n_default_text='{{resendCode}}' values={{ resendCode: resendCodeText.current }} />
                </CaptionText>
            </div>
        </PhoneVerificationCard>
    );
});

export default ConfirmYourEmail;
