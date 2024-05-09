import { useMutation } from '@deriv/api';
import { VERIFICATION_SERVICES } from '@deriv/shared';

/** A hook for requesting OTP which is sent on whatsapp or sms platforms */
const useGetPhoneNumberOTP = () => {
    const { data, mutate, ...rest } = useMutation('phone_number_challenge');

    const requestOnSMS = () => {
        mutate({ payload: { carrier: VERIFICATION_SERVICES.SMS } });
    };
    const requestOnWhatsApp = () => {
        mutate({ payload: { carrier: VERIFICATION_SERVICES.WHATSAPP } });
    };

    return {
        data: data?.phone_number_challenge,
        requestOnWhatsApp,
        requestOnSMS,
        mutate,
        ...rest,
    };
};

export default useGetPhoneNumberOTP;
