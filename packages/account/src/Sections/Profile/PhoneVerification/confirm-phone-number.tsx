import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import clsx from 'clsx';

import {
    useGetPhoneNumberList,
    useGrowthbookGetFeatureValue,
    usePhoneNumberVerificationSetTimer,
    usePhoneVerificationAnalytics,
    useRequestPhoneNumberOTP,
    useSettings,
} from '@deriv/hooks';
import { VERIFICATION_SERVICES } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Button, InputPhoneNumber, Snackbar, Text, TextFieldAddon } from '@deriv-com/quill-ui';
import { TCountryCodes } from '@deriv-com/quill-ui/dist/types';
import { Localize, useTranslations } from '@deriv-com/translations';

import { validatePhoneNumber } from './validation';

type TConfirmPhoneNumber = {
    show_confirm_phone_number?: boolean;
    setOtpVerification: (value: { show_otp_verification: boolean; phone_verification_type: string }) => void;
};

const ConfirmPhoneNumber = observer(({ show_confirm_phone_number, setOtpVerification }: TConfirmPhoneNumber) => {
    const [phone_number, setPhoneNumber] = useState('');
    const [phone_verification_type, setPhoneVerificationType] = useState('');
    const [isCountryCodeDropdownEnabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_country_code_dropdown',
    });
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
    const {
        is_global_sms_available,
        is_global_whatsapp_available,
        available_carriers,
        formatted_countries_list,
        short_code_selected,
        selected_phone_code,
        selected_country_list,
        isLoading,
    } = useGetPhoneNumberList();
    const { data: account_settings, invalidate } = useSettings();
    const [selectedCountryCode, setSelectedCountryCode] = useState<TCountryCodes>();
    const { ui } = useStore();
    const { setShouldShowPhoneNumberOTP } = ui;
    const { next_phone_otp_request_timer, is_phone_otp_timer_loading } = usePhoneNumberVerificationSetTimer(true);
    const { trackPhoneVerificationEvents } = usePhoneVerificationAnalytics();
    const { localize } = useTranslations();
    const only_1_carrier_supported = available_carriers === 1;

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
            isCountryCodeDropdownEnabled ? e.target.value : `+${e.target.value}`,
            setErrorMessage,
            setIsDisabledRequestButton,
            !!isCountryCodeDropdownEnabled
        );
    };

    const handleOnChangeCountryCode = (item: TCountryCodes) => {
        setSelectedCountryCode(item);
    };

    const handleSubmit = async (phone_verification_type: string) => {
        setIsButtonLoading(true);
        setPhoneVerificationType(phone_verification_type);
        const { error } = await setUsersPhoneNumber({
            phone: isCountryCodeDropdownEnabled ? phone_number : `+${phone_number}`,
            ...(isCountryCodeDropdownEnabled
                ? {
                      calling_country_code: selectedCountryCode?.phone_code || selected_phone_code,
                  }
                : {}),
        });

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

    const isCarrierSupportedForSms =
        !isCountryCodeDropdownEnabled ||
        (selectedCountryCode
            ? //@ts-expect-error carriers is not defined in TCountryCodes from quill-ui
              selectedCountryCode?.carriers.includes('sms') && is_global_sms_available
            : selected_country_list?.carriers.includes('sms') && is_global_sms_available);

    const isCarrierSupportedForWhatsApp =
        !isCountryCodeDropdownEnabled ||
        (selectedCountryCode
            ? //@ts-expect-error carriers is not defined in TCountryCodes from quill-ui
              selectedCountryCode?.carriers.includes('whatsapp') && is_global_whatsapp_available
            : selected_country_list?.carriers.includes('whatsapp') && is_global_whatsapp_available);

    const getSMSButtonVariant = () => {
        if (!isCountryCodeDropdownEnabled) return 'secondary';
        return isCarrierSupportedForWhatsApp ? 'secondary' : 'primary';
    };

    const getSmsButtonColor = () => {
        if (!isCountryCodeDropdownEnabled) return 'black-white';
        return isCarrierSupportedForWhatsApp ? 'black-white' : 'coral';
    };

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
                {isCountryCodeDropdownEnabled ? (
                    formatted_countries_list &&
                    !isLoading && (
                        <InputPhoneNumber
                            countryCodes={formatted_countries_list}
                            codeLabel={localize('Code')}
                            shortCode={selectedCountryCode?.short_code || short_code_selected}
                            onCodeChange={handleOnChangeCountryCode}
                            value={phone_number}
                            label={localize('Phone number')}
                            onChange={handleOnChangePhoneNumber}
                            status={error_message ? 'error' : 'neutral'}
                            message={error_message}
                        />
                    )
                ) : (
                    <TextFieldAddon
                        type='number'
                        label={localize('Phone number')}
                        value={phone_number}
                        status={error_message ? 'error' : 'neutral'}
                        message={error_message}
                        className='phone-verification__card--inputfield__phone-number-input'
                        onChange={handleOnChangePhoneNumber}
                        addonLabel='+'
                    />
                )}
            </div>
            <div
                className={clsx('phone-verification__card--buttons_container', {
                    'phone-verification__card--buttons_container--with-1-carrier': only_1_carrier_supported,
                })}
            >
                {(isCountryCodeDropdownEnabled ? isCarrierSupportedForSms : true) && !isLoading && (
                    <Button
                        variant={getSMSButtonVariant()}
                        color={getSmsButtonColor()}
                        fullWidth={isCountryCodeDropdownEnabled ? isCarrierSupportedForWhatsApp : true}
                        size='lg'
                        onClick={() => handleSubmit(VERIFICATION_SERVICES.SMS)}
                        disabled={
                            is_button_loading ||
                            !!next_phone_otp_request_timer ||
                            is_disabled_request_button ||
                            is_phone_otp_timer_loading
                        }
                    >
                        <Text bold>
                            <Localize i18n_default_text='Get code via SMS' />
                        </Text>
                    </Button>
                )}
                {(isCountryCodeDropdownEnabled ? isCarrierSupportedForWhatsApp : true) && !isLoading && (
                    <Button
                        color='coral'
                        fullWidth={isCountryCodeDropdownEnabled ? isCarrierSupportedForSms : true}
                        size='lg'
                        onClick={() => handleSubmit(VERIFICATION_SERVICES.WHATSAPP)}
                        disabled={
                            is_button_loading ||
                            !!next_phone_otp_request_timer ||
                            is_disabled_request_button ||
                            is_phone_otp_timer_loading
                        }
                    >
                        <Text color='white' bold>
                            <Localize i18n_default_text='Get code via WhatsApp' />
                        </Text>
                    </Button>
                )}
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
