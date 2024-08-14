import { useState, useEffect, ChangeEvent } from 'react';
import PhoneVerificationCard from './phone-verification-card';
import { Button, Snackbar, Text, TextFieldAddon } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import {
    usePhoneNumberVerificationSetTimer,
    usePhoneVerificationAnalytics,
    useRequestPhoneNumberOTP,
    useSettings,
} from '@deriv/hooks';
import { VERIFICATION_SERVICES } from '@deriv/shared';
import { validatePhoneNumber } from './validation';

type TConfirmPhoneNumber = {
    show_confirm_phone_number?: boolean;
    setOtpVerification: (value: { show_otp_verification: boolean; phone_verification_type: string }) => void;
};

const ConfirmPhoneNumber = observer(({ show_confirm_phone_number, setOtpVerification }: TConfirmPhoneNumber) => {
    const [phone_number, setPhoneNumber] = useState('');
    const [phone_verification_type, setPhoneVerificationType] = useState('');
    const [is_button_loading, setIsButtonLoading] = useState(false);
    const {
        requestOnSMS,
        requestOnWhatsApp,
        error_message,
        setErrorMessage,
        setUsersPhoneNumber,
        is_email_verified,
        email_otp_error,
    } = useRequestPhoneNumberOTP();
    const { data: account_settings, invalidate } = useSettings();
    const { ui } = useStore();
    const { setShouldShowPhoneNumberOTP } = ui;
    const { next_otp_request } = usePhoneNumberVerificationSetTimer(true);
    const { trackPhoneVerificationEvents } = usePhoneVerificationAnalytics();

    useEffect(() => {
        if (show_confirm_phone_number) {
            trackPhoneVerificationEvents({
                action: 'open',
                subform_name: 'verify_phone_screen',
            });
        }
    }, [show_confirm_phone_number, trackPhoneVerificationEvents]);

    useEffect(() => {
        setPhoneNumber(account_settings?.phone?.replace('+', '') || '');
    }, [account_settings?.phone]);

    useEffect(() => {
        if (email_otp_error) {
            invalidate('get_settings').then(() => setIsButtonLoading(false));
        }
        if (is_email_verified) {
            setIsButtonLoading(false);
            setOtpVerification({ show_otp_verification: true, phone_verification_type });
            setShouldShowPhoneNumberOTP(true);
        }
    }, [is_email_verified, email_otp_error, invalidate]);

    const handleOnChangePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
        validatePhoneNumber(`+${e.target.value}`, setErrorMessage);
    };

    const handleSubmit = async (phone_verification_type: string) => {
        setIsButtonLoading(true);
        setPhoneVerificationType(phone_verification_type);
        const { error } = await setUsersPhoneNumber({ phone: `+${phone_number}` });

        if (!error) {
            trackPhoneVerificationEvents({
                action: 'click_cta',
                subform_name: 'verify_phone_screen',
            });
            phone_verification_type === VERIFICATION_SERVICES.SMS ? requestOnSMS() : requestOnWhatsApp();
        } else {
            setIsButtonLoading(false);
        }
    };

    return (
        <PhoneVerificationCard>
            <Text bold>
                <Localize i18n_default_text='Confirm your phone number' />
            </Text>
            <div className='phone-verification__card--inputfield'>
                <TextFieldAddon
                    label={localize('Phone number')}
                    value={phone_number}
                    status={error_message ? 'error' : 'neutral'}
                    message={error_message}
                    onChange={handleOnChangePhoneNumber}
                    addonLabel='+'
                />
            </div>
            <div className='phone-verification__card--buttons_container'>
                <Button
                    variant='secondary'
                    color='black-white'
                    fullWidth
                    size='lg'
                    onClick={() => handleSubmit(VERIFICATION_SERVICES.SMS)}
                    disabled={is_button_loading || !!next_otp_request}
                >
                    <Text bold>
                        <Localize i18n_default_text='Get code via SMS' />
                    </Text>
                </Button>
                <Button
                    color='black-white'
                    fullWidth
                    size='lg'
                    onClick={() => handleSubmit(VERIFICATION_SERVICES.WHATSAPP)}
                    disabled={is_button_loading || !!next_otp_request}
                >
                    <Text color='white' bold>
                        <Localize i18n_default_text='Get code via WhatsApp' />
                    </Text>
                </Button>
            </div>
            <Snackbar
                hasCloseButton={false}
                message={
                    <Localize
                        i18n_default_text='An error occurred. Request a new OTP in {{next_phone_number_attempt_timestamp}}.'
                        values={{ next_phone_number_attempt_timestamp: next_otp_request }}
                    />
                }
                isVisible={!!next_otp_request}
            />
        </PhoneVerificationCard>
    );
});

export default ConfirmPhoneNumber;
