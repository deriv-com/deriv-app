import React, { useEffect, useState } from 'react';
import { useMutation } from '@deriv/api';
import { TSocketError } from '@deriv/api/types';
import { localize, Localize } from '@deriv/translations';
import useRequestPhoneNumberOTP from './useRequestPhoneNumberOTP';
import { useStore } from '@deriv/stores';
import useSettings from './useSettings';

/** A hook for verifying Phone Number OTP and Email OTP */
const useSendOTPVerificationCode = () => {
    const [phone_otp_error_message, setPhoneOtpErrorMessage] = useState<React.ReactNode>('');
    const [show_cool_down_period_modal, setShowCoolDownPeriodModal] = useState(false);
    const { ui } = useStore();
    const { setIsForcedToExitPnv } = ui;
    const {
        data,
        mutate,
        error: phone_otp_error,
        isSuccess: is_phone_number_verified,
        ...rest
    } = useMutation('phone_number_verify');
    const { refetch } = useSettings();
    const {
        sendEmailOTPVerification,
        email_otp_error,
        is_email_verified,
        getCurrentCarrier,
        getOtherCarrier,
        requestOnSMS,
        requestOnWhatsApp,
    } = useRequestPhoneNumberOTP();

    const formatPhoneOtpError = (error: TSocketError<'phone_number_verify'>['error']) => {
        switch (error.code) {
            case 'PhoneCodeExpired':
                setPhoneOtpErrorMessage(localize('Code expired. Get a new one.'));
                break;
            case 'InvalidOTP':
                setPhoneOtpErrorMessage(localize('Invalid code. Try again.'));
                break;
            case 'NoAttemptsLeft':
                refetch();
                setIsForcedToExitPnv(true);
                setShowCoolDownPeriodModal(true);
                break;
            default:
                setPhoneOtpErrorMessage(error.message);
                break;
        }
    };

    const formatEmailOtpError = (error: TSocketError<'phone_number_challenge'>['error']) => {
        switch (error.code) {
            case 'EmailCodeExpired':
                setPhoneOtpErrorMessage(localize('Code expired. Get a new code.'));
                break;
            case 'InvalidToken':
                setPhoneOtpErrorMessage(localize('Invalid code. Try again or get a new code.'));
                break;
            case 'NoAttemptsLeft':
                refetch();
                setIsForcedToExitPnv(true);
                setShowCoolDownPeriodModal(true);
                break;
            case 'PhoneNumberVerificationSuspended':
                setPhoneOtpErrorMessage(
                    <Localize
                        i18n_default_text="We're unable to send codes via {{ current_carrier }} right now. Get your code by {{other_carriers}}."
                        values={{
                            current_carrier: getCurrentCarrier(),
                            other_carriers: getOtherCarrier(),
                        }}
                    />
                );
                break;
            default:
                setPhoneOtpErrorMessage(error.message);
                break;
        }
    };

    useEffect(() => {
        if (phone_otp_error) {
            // @ts-expect-error will remove once solved
            formatPhoneOtpError(phone_otp_error);
        } else if (email_otp_error) {
            // @ts-expect-error will remove once solved
            formatEmailOtpError(email_otp_error);
        }
    }, [phone_otp_error, email_otp_error]);

    const sendPhoneOTPVerification = (value: string) => {
        mutate({ payload: { otp: value } });
    };

    return {
        data,
        sendPhoneOTPVerification,
        sendEmailOTPVerification,
        requestOnSMS,
        requestOnWhatsApp,
        email_otp_error,
        phone_otp_error,
        phone_otp_error_message,
        setPhoneOtpErrorMessage,
        show_cool_down_period_modal,
        setShowCoolDownPeriodModal,
        is_phone_number_verified,
        is_email_verified,
        mutate,
        ...rest,
    };
};

export default useSendOTPVerificationCode;
