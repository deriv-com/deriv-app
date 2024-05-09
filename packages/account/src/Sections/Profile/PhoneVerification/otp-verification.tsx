import React from 'react';
import PhoneVerificationCard from './phone-verification-card';
import { Text } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { Input } from '@deriv/components';
import { VERIFICATION_SERVICES } from '@deriv/shared';
import ResendCodeTimer from './resend-code-timer';

type TOTPVerification = {
    phone_verification_type: string;
};

const OTPVerification = observer(({ phone_verification_type }: TOTPVerification) => {
    const { client, ui } = useStore();
    const { account_settings } = client;
    const { email, phone } = account_settings;
    //TODO: this shall be replace by BE API call when it's ready
    const { should_show_phone_number_otp } = ui;

    const convertPhoneTypeDisplay = () => {
        if (phone_verification_type === VERIFICATION_SERVICES.SMS) return phone_verification_type.toUpperCase();

        return (
            phone_verification_type.charAt(0).toUpperCase() +
            phone_verification_type.slice(1, 5) +
            phone_verification_type.charAt(5).toUpperCase() +
            phone_verification_type.slice(6)
        );
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
                            values={{ phone_verification_type: convertPhoneTypeDisplay(), users_phone_number: phone }}
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
                <ResendCodeTimer resend_code_text='Resend code' count_from={60} />
            </div>
        </PhoneVerificationCard>
    );
});

export default OTPVerification;
