import { useVerifyEmail } from '@deriv/api';
import { useStore } from '@deriv/stores';
import React from 'react';

type TVerifyEmailPayload = Parameters<ReturnType<typeof useVerifyEmail>['mutate']>[0];
/** A hook for requesting OTP for Email Verification */
const useGetEmailVerificationOTP = () => {
    const { client } = useStore();
    const { email } = client;
    const { mutate: verifyEmail, ...rest } = useVerifyEmail();

    const requestEmailVerificationOTP = React.useCallback(() => {
        const payload: TVerifyEmailPayload = { verify_email: email, type: 'phone_number_verification' };
        verifyEmail(payload);
    }, [verifyEmail, email]);

    return {
        requestEmailVerificationOTP,
        verifyEmail,
        ...rest,
    };
};

export default useGetEmailVerificationOTP;
