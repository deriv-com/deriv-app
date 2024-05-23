import { useVerifyEmail } from '@deriv/api';
import { useStore } from '@deriv/stores';

type TVerifyEmailPayload = Parameters<ReturnType<typeof useVerifyEmail>['mutate']>[0];
/** A hook for requesting OTP for Email Verification */
const useGetEmailVerificationOTP = () => {
    const { client } = useStore();
    const { email } = client;
    const { data, mutate, ...rest } = useVerifyEmail();
    const payload: TVerifyEmailPayload = { verify_email: email, type: 'phone_number_verification' };

    const requestEmailVerificationOTP = () => {
        mutate(payload);
    };

    return {
        data,
        requestEmailVerificationOTP,
        mutate,
        ...rest,
    };
};

export default useGetEmailVerificationOTP;
