import React from 'react';
import { useMutation } from '@deriv/api';
import { TSocketError } from '@deriv/api/types';
import { localize } from '@deriv/translations';

/** A hook for requesting OTP which is sent on whatsapp or sms platforms */
const useSendOTPVerificationCode = () => {
    const [phone_otp_error_message, setPhoneOtpErrorMessage] = React.useState('');
    const {
        data,
        mutate,
        error: phone_otp_error,
        isSuccess: is_phone_number_verified,
        ...rest
    } = useMutation('phone_number_verify');

    const handleError = (error: TSocketError<'phone_number_verify'>['error']) => {
        switch (error.code) {
            case 'ExpiredCode':
                setPhoneOtpErrorMessage(localize('Code expired. Please get a new one.'));
                break;
            case 'InvalidOTP':
                setPhoneOtpErrorMessage(localize('Invalid code. Please try again.'));
                break;
            case 'NoAttemptsLeft':
                setPhoneOtpErrorMessage(localize('Invalid code. OTP limit reached.'));
                break;
            default:
                setPhoneOtpErrorMessage(error.message);
                break;
        }
    };

    React.useEffect(() => {
        if (phone_otp_error) {
            // @ts-expect-error will remove once solved
            handleError(phone_otp_error);
        }
    }, [phone_otp_error]);

    const sendPhoneOTPVerification = (value: string) => {
        mutate({ payload: { otp: value } });
    };

    return {
        data,
        sendPhoneOTPVerification,
        phone_otp_error,
        phone_otp_error_message,
        setPhoneOtpErrorMessage,
        is_phone_number_verified,
        mutate,
        ...rest,
    };
};

export default useSendOTPVerificationCode;
