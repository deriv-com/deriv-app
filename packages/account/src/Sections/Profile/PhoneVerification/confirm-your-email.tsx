import React from 'react';
import PhoneVerificationCard from './phone-verification-card';
import { Text } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { Input } from '@deriv/components';
import ResendCodeTimer from './resend-code-timer';

const ConfirmYourEmail = observer(() => {
    const { client } = useStore();
    const { account_settings } = client;
    const { email } = account_settings;

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
                <ResendCodeTimer />
            </div>
        </PhoneVerificationCard>
    );
});

export default ConfirmYourEmail;
