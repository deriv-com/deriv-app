import { useMutation } from '@deriv/api';
import { VERIFICATION_SERVICES } from '@deriv/shared';

/** A hook for requesting OTP which is sent on whatsapp or sms platforms */
const useGetPhoneNumberOTP = () => {
    const {
        data,
        mutate,
        error: email_otp_error,
        isSuccess: is_email_verified,
        ...rest
    } = useMutation('phone_number_challenge');

    const requestOnSMS = () => {
        mutate({
            payload: { carrier: VERIFICATION_SERVICES.SMS, email_code: localStorage.getItem('email_otp_code') || '' },
        });
    };
    const requestOnWhatsApp = () => {
        mutate({
            payload: {
                carrier: VERIFICATION_SERVICES.WHATSAPP,
                email_code: localStorage.getItem('email_otp_code') || '',
            },
        });
    };

    const sendEmailOTPVerification = (value: string) => {
        mutate({ payload: { email_code: value } });
    };

    return {
        data: data?.phone_number_challenge,
        email_otp_error,
        is_email_verified,
        requestOnWhatsApp,
        requestOnSMS,
        sendEmailOTPVerification,
        mutate,
        ...rest,
    };
};

export default useGetPhoneNumberOTP;
