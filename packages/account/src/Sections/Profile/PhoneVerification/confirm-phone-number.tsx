import { useState, useEffect, ChangeEvent, Fragment } from 'react';
import {
    usePhoneNumberVerificationSetTimer,
    usePhoneVerificationAnalytics,
    useRequestPhoneNumberOTP,
    useSettings,
} from '@deriv/hooks';
import { VERIFICATION_SERVICES } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Button, InputPhoneNumber, Snackbar, Text } from '@deriv-com/quill-ui';
import { Localize, useTranslations } from '@deriv-com/translations';
import { validatePhoneNumber } from './validation';
import clsx from 'clsx';
import { TCountryCodes } from '@deriv-com/quill-ui/dist/types';

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
        is_disabled_request_button,
        setIsDisabledRequestButton,
    } = useRequestPhoneNumberOTP();
    const { data: account_settings, invalidate } = useSettings();
    const [selectedCountryCode, setSelectedCountryCode] = useState<TCountryCodes>();
    const { ui } = useStore();
    const { setShouldShowPhoneNumberOTP } = ui;
    const { next_phone_otp_request_timer, is_phone_otp_timer_loading } = usePhoneNumberVerificationSetTimer(true);
    const { trackPhoneVerificationEvents } = usePhoneVerificationAnalytics();
    const { localize } = useTranslations();

    const country_codes = [
        { name: 'United States', short_code: 'US', phone_code: '1', carriers: ['whatsapp'] },
        { name: 'Malaysia', short_code: 'MY', phone_code: '60', carriers: ['sms', 'whatsapp'] },
        { name: 'United Kingdom', short_code: 'GB', phone_code: '44', carriers: ['sms', 'whatsapp'] },
        { name: 'Australia', short_code: 'AU', phone_code: '61', carriers: ['sms', 'whatsapp'] },
        { name: 'Canada', short_code: 'CA', phone_code: '1', carriers: ['sms', 'whatsapp'] },
        { name: 'Singapore', short_code: 'SG', phone_code: '65', carriers: ['sms', 'whatsapp'] },
        { name: 'Indonesia', short_code: 'ID', phone_code: '62', carriers: ['sms', 'whatsapp'] },
        { name: 'Vietnam', short_code: 'VN', phone_code: '84', carriers: ['sms', 'whatsapp'] },
        { name: 'Thailand', short_code: 'TH', phone_code: '66', carriers: ['sms', 'whatsapp'] },
        { name: 'Philippines', short_code: 'PH', phone_code: '63', carriers: ['sms', 'whatsapp'] },
    ];

    useEffect(() => {
        if (show_confirm_phone_number) {
            trackPhoneVerificationEvents({
                action: 'open',
                subform_name: 'verify_phone_screen',
            });
        }
    }, [show_confirm_phone_number, trackPhoneVerificationEvents]);

    useEffect(() => {
        setPhoneNumber(account_settings?.phone?.replace(/\D/g, '') || '');
    }, [account_settings?.phone]);

    useEffect(() => {
        if (email_otp_error) {
            trackPhoneVerificationEvents({
                action: 'error',
                subform_name: 'verify_phone_screen',
                //@ts-expect-error will fix this later
                error_code: email_otp_error.code,
            });
            invalidate('get_settings').then(() => setIsButtonLoading(false));
        }
        if (is_email_verified) {
            setIsButtonLoading(false);
            setOtpVerification({ show_otp_verification: true, phone_verification_type });
            setShouldShowPhoneNumberOTP(true);
        }
    }, [is_email_verified, email_otp_error, invalidate, trackPhoneVerificationEvents]);

    const handleOnChangePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
        validatePhoneNumber(
            `+${selectedCountryCode?.phone_code}${e.target.value}`,
            setErrorMessage,
            setIsDisabledRequestButton
        );
    };

    const handleOnChangeCountryCode = (item: TCountryCodes) => {
        setSelectedCountryCode(item);
    };

    const handleSubmit = async (phone_verification_type: string) => {
        setIsButtonLoading(true);
        setPhoneVerificationType(phone_verification_type);
        const { error } = await setUsersPhoneNumber({ phone: `+${selectedCountryCode?.phone_code}${phone_number}` });

        if (!error) {
            trackPhoneVerificationEvents({
                action: 'click_cta',
                cta_name:
                    phone_verification_type === VERIFICATION_SERVICES.SMS
                        ? 'Get code via SMS'
                        : 'Get code via WhatsApp',
                subform_name: 'verify_phone_screen',
            });
            phone_verification_type === VERIFICATION_SERVICES.SMS ? requestOnSMS() : requestOnWhatsApp();
        } else {
            setIsButtonLoading(false);
        }
    };

    const isSingularValue = (time: number) => {
        return time === 1;
    };

    const resendPhoneOtpTimer = () => {
        let resendPhoneOtpTimer = '';
        if (next_phone_otp_request_timer) {
            next_phone_otp_request_timer < 60
                ? (resendPhoneOtpTimer = `${next_phone_otp_request_timer} ${
                      isSingularValue(next_phone_otp_request_timer) ? localize('second') : localize('seconds')
                  }`)
                : (resendPhoneOtpTimer = `${Math.round(next_phone_otp_request_timer / 60)} ${
                      isSingularValue(Math.round(next_phone_otp_request_timer / 60))
                          ? localize('minute')
                          : localize('minutes')
                  }`);
        } else {
            resendPhoneOtpTimer = '';
        }

        return resendPhoneOtpTimer;
    };

    //@ts-expect-error carriers is not defined in TCountryCodes from quill-ui
    const isCarrierSupportedForSms = selectedCountryCode?.carriers.includes('sms');
    //@ts-expect-error carriers is not defined in TCountryCodes from quill-ui
    const isCarrierSupportedForWhatsApp = selectedCountryCode?.carriers.includes('whatsapp');

    return (
        <Fragment>
            <Text bold>
                <Localize i18n_default_text='Step 2 of 3: Confirm your phone number' />
            </Text>
            <div
                className={clsx('phone-verification__card--inputfield', {
                    'phone-verification__card--inputfield--error': error_message,
                })}
            >
                <InputPhoneNumber
                    countryCodes={country_codes}
                    codeLabel={localize('Code')}
                    shortCode={selectedCountryCode?.short_code}
                    onCodeChange={handleOnChangeCountryCode}
                    value={phone_number}
                    label={localize('Phone Number')}
                    onChange={handleOnChangePhoneNumber}
                    status={error_message ? 'error' : 'neutral'}
                    message={error_message}
                />
            </div>
            <div className='phone-verification__card--buttons_container'>
                <Button
                    variant='secondary'
                    color='black-white'
                    fullWidth
                    size='lg'
                    onClick={() => handleSubmit(VERIFICATION_SERVICES.SMS)}
                    disabled={
                        is_button_loading ||
                        !!next_phone_otp_request_timer ||
                        is_disabled_request_button ||
                        is_phone_otp_timer_loading ||
                        !isCarrierSupportedForSms
                    }
                >
                    <Text bold>
                        <Localize i18n_default_text='Get code via SMS' />
                    </Text>
                </Button>
                <Button
                    color='coral'
                    fullWidth
                    size='lg'
                    onClick={() => handleSubmit(VERIFICATION_SERVICES.WHATSAPP)}
                    disabled={
                        is_button_loading ||
                        !!next_phone_otp_request_timer ||
                        is_disabled_request_button ||
                        is_phone_otp_timer_loading ||
                        !isCarrierSupportedForWhatsApp
                    }
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
                        i18n_default_text='Request new code in {{next_phone_number_attempt_timestamp}}.'
                        values={{ next_phone_number_attempt_timestamp: resendPhoneOtpTimer() }}
                    />
                }
                isVisible={!!next_phone_otp_request_timer}
            />
        </Fragment>
    );
});

export default ConfirmPhoneNumber;
