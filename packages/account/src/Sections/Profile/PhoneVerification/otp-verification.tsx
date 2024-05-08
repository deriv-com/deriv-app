import React, { useRef } from 'react';
import PhoneVerificationCard from './phone-verification-card';
import { Button, CaptionText, Text } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { Input } from '@deriv/components';

type TOTPVerification = {
    phone_verification_type: string;
};

const OTPVerification = observer(({ phone_verification_type }: TOTPVerification) => {
    const [timer, setTimer] = React.useState(60);
    const [startTimer, setStartTimer] = React.useState(false);

    const { client, ui } = useStore();
    const { account_settings } = client;
    const { email, phone } = account_settings;
    const { should_show_phone_number_otp } = ui;

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
                {should_show_phone_number_otp ? (
                    <Localize i18n_default_text='Verify your number' />
                ) : (
                    <Localize i18n_default_text="Confirm it's you" />
                )}
            </Text>
            <div className='phone-verification__card--email-verification-content'>
                {should_show_phone_number_otp ? (
                    <Text size='sm'>
                        <Localize
                            i18n_default_text='Enter the 6-digit code sent to you via {{phone_verification_type}} at {{users_phone_number}}:'
                            values={{ phone_verification_type, users_phone_number: phone }}
                        />
                    </Text>
                ) : (
                    <React.Fragment>
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
                    </React.Fragment>
                )}
            </div>
            <div className='phone-verification__card--email-verification-otp-container'>
                <Input id='otp_code' type='text' name='otp_code' label={localize('OTP code')} data-lpignore='true' />
                <Button variant='tertiary' onClick={resendCode} disabled={startTimer} color='black'>
                    <CaptionText bold underlined>
                        <Localize i18n_default_text='{{resendCode}}' values={{ resendCode: resendCodeText.current }} />
                    </CaptionText>
                </Button>
            </div>
        </PhoneVerificationCard>
    );
});

export default OTPVerification;
