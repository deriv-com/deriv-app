import React from 'react';
import { useMutation } from '@deriv/api';
import { TSocketEndpointNames, TSocketError } from '@deriv/api/types';

/** A hook for requesting OTP which is sent on whatsapp or sms platforms */
const useSendOTPVerificationCode = () => {
    const [phone_otp_error_message, setPhoneOtpErrorMessage] = React.useState('');
    const {
        data,
        mutate,
        error: phone_otp_error,
        isSuccess: phone_number_verified,
        ...rest
    } = useMutation('phone_number_verify');

    const handleError = (error: TSocketError<TSocketEndpointNames>['error']) => {
        switch (error.code) {
            case 'ExpiredCode':
                setPhoneOtpErrorMessage('Code expired. Please get a new one.');
                break;
            case 'InvalidOTP':
                setPhoneOtpErrorMessage('Invalid code. Please try again.');
                break;
            case 'NoAttemptsLeft':
                setPhoneOtpErrorMessage('Invalid code. OTP limit reached.');
                break;
            default:
                setPhoneOtpErrorMessage(error.message);
                break;
        }
    };

    React.useEffect(() => {
        if (phone_otp_error) {
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
        phone_number_verified,
        mutate,
        ...rest,
    };
};

export default useSendOTPVerificationCode;
