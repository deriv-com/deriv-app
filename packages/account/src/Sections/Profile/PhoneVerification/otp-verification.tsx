import { useEffect, useState, useCallback, Fragment } from 'react';
import PhoneVerificationCard from './phone-verification-card';
import { Text, InputGroupButton } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useSendOTPVerificationCode, useSettings } from '@deriv/hooks';
import { convertPhoneTypeDisplay } from '../../../Helpers/utils';
import ResendCodeTimer from './resend-code-timer';
import DidntGetTheCodeModal from './didnt-get-the-code-modal';
import PhoneNumberVerifiedModal from './phone-number-verified-modal';

type TOTPVerification = {
    phone_verification_type: string;
    setOtpVerification: (value: { show_otp_verification: boolean; phone_verification_type: string }) => void;
};

const OTPVerification = observer(({ phone_verification_type, setOtpVerification }: TOTPVerification) => {
    const { client, ui } = useStore();
    const { setVerificationCode } = client;
    const { data: account_settings, invalidate } = useSettings();
    const [should_show_phone_number_verified_modal, setShouldShowPhoneNumberVerifiedModal] = useState(false);
    const [should_show_didnt_get_the_code_modal, setShouldShowDidntGetTheCodeModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [is_button_disabled, setIsButtonDisabled] = useState(false);

    const {
        sendPhoneOTPVerification,
        phone_otp_error_message,
        setPhoneOtpErrorMessage,
        is_phone_number_verified,
        is_email_verified,
        sendEmailOTPVerification,
        requestOnSMS,
        requestOnWhatsApp,
        email_otp_error,
    } = useSendOTPVerificationCode();
    const { should_show_phone_number_otp } = ui;

    const reInitializeGetSettings = useCallback(() => {
        invalidate('get_settings').then(() => {
            setIsButtonDisabled(false);
        });
    }, [invalidate]);

    useEffect(() => {
        setIsButtonDisabled(true);
        reInitializeGetSettings();
    }, [reInitializeGetSettings]);

    useEffect(() => {
        if (is_phone_number_verified) {
            reInitializeGetSettings();
            setShouldShowPhoneNumberVerifiedModal(true);
        } else if (is_email_verified && !should_show_phone_number_otp) {
            setVerificationCode(otp, 'phone_number_verification');
            setOtpVerification({ show_otp_verification: false, phone_verification_type: '' });
        }
    }, [is_phone_number_verified, is_email_verified, setOtpVerification, should_show_phone_number_otp]);

    const clearOtpValue = () => {
        setOtp('');
        setPhoneOtpErrorMessage('');
    };

    const handleGetOtpValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
        setPhoneOtpErrorMessage('');
    };

    const handleVerifyOTP = () => {
        if (should_show_phone_number_otp) {
            sendPhoneOTPVerification(otp);
        } else {
            sendEmailOTPVerification(otp);
        }
    };

    return (
        <PhoneVerificationCard is_small_card>
            <PhoneNumberVerifiedModal
                should_show_phone_number_verified_modal={should_show_phone_number_verified_modal}
                setShouldShowPhoneNumberVerifiedModal={setShouldShowPhoneNumberVerifiedModal}
            />
            {should_show_phone_number_otp && (
                <DidntGetTheCodeModal
                    clearOtpValue={clearOtpValue}
                    setIsButtonDisabled={setIsButtonDisabled}
                    reInitializeGetSettings={reInitializeGetSettings}
                    requestOnSMS={requestOnSMS}
                    requestOnWhatsApp={requestOnWhatsApp}
                    email_otp_error={email_otp_error}
                    is_email_verified={is_email_verified}
                    should_show_didnt_get_the_code_modal={should_show_didnt_get_the_code_modal}
                    setShouldShowDidntGetTheCodeModal={setShouldShowDidntGetTheCodeModal}
                    phone_verification_type={phone_verification_type}
                    setOtpVerification={setOtpVerification}
                />
            )}
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
                            values={{
                                phone_verification_type: localize(convertPhoneTypeDisplay(phone_verification_type)),
                                users_phone_number: account_settings?.phone,
                            }}
                        />
                    </Text>
                ) : (
                    <Fragment>
                        <Text size='sm'>
                            <Localize
                                i18n_default_text="We've sent a verification code to <0>{{users_email}}</0>."
                                values={{ users_email: account_settings?.email }}
                                components={[<strong key={0} />]}
                            />
                        </Text>
                        <Text size='sm'>
                            <Localize i18n_default_text='Enter the code or click the link in the email to verify that the account belongs to you.' />
                        </Text>
                    </Fragment>
                )}
            </div>
            <div className='phone-verification__card--email-verification-otp-container'>
                <InputGroupButton
                    status={phone_otp_error_message ? 'error' : 'neutral'}
                    buttonLabel={localize('Verify')}
                    label={localize('OTP code')}
                    buttonCallback={handleVerifyOTP}
                    onChange={handleGetOtpValue}
                    message={phone_otp_error_message}
                    value={otp}
                    type='number'
                    maxLength={6}
                    /* eslint-disable @typescript-eslint/ban-ts-comment */
                    /* @ts-expect-error [TODO] fix type error */
                    buttonDisabled={otp.length < 6}
                />
                <ResendCodeTimer
                    clearOtpValue={clearOtpValue}
                    is_button_disabled={is_button_disabled}
                    setIsButtonDisabled={setIsButtonDisabled}
                    should_show_resend_code_button={!should_show_phone_number_otp}
                    setShouldShowDidntGetTheCodeModal={setShouldShowDidntGetTheCodeModal}
                    reInitializeGetSettings={reInitializeGetSettings}
                />
            </div>
        </PhoneVerificationCard>
    );
});

export default OTPVerification;
