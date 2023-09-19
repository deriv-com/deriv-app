import { useAuthorize, useRequest } from '@deriv/api';
import React from 'react';

type TAccountSecurityPayload = NonNullable<
    NonNullable<Parameters<ReturnType<typeof useRequest<'account_security'>>['mutate']>[0]>['payload']
>;

const useAccountSecurity = () => {
    const { isSuccess: success_auth } = useAuthorize();
    const { mutate, ...rest } = useRequest('account_security');
    return {
        mutate,
        success_auth,
        ...rest,
    };
};

/**
 * Makes an API call to get 2FA status.
 * @name useGetTwoFa
 */

const useGetTwoFa = () => {
    const { data, mutate, success_auth, ...rest } = useAccountSecurity();

    const getTwoFA = React.useCallback(() => {
        if (success_auth) {
            mutate({ payload: { totp_action: 'status' } });
        }
    }, [success_auth, mutate]);

    return {
        is_TwoFA_enabled: !!data?.account_security?.totp?.is_enabled,
        getTwoFA,
        ...rest,
    };
};

/**
 * Makes an API call to get secret key.
 * @name useGetSecretKey
 */

const useGetSecretKey = () => {
    const { data, mutate, success_auth, ...rest } = useAccountSecurity();

    const getSecretKey = React.useCallback(() => {
        if (success_auth) {
            mutate({ payload: { totp_action: 'generate' } });
        }
    }, [success_auth, mutate]);

    return {
        data,
        getSecretKey,
        ...rest,
    };
};

/**
 * Makes an API call to send OTP entered by user.
 * @name useSendUserOTP
 */

const useSendUserOTP = () => {
    const { data, mutate, success_auth, ...rest } = useAccountSecurity();

    const sendUserOTP = React.useCallback(
        (payload: TAccountSecurityPayload) => {
            if (success_auth) {
                mutate({ payload });
            }
        },
        [success_auth, mutate]
    );

    return {
        is_TwoFA_enabled: !!data?.account_security?.totp?.is_enabled,
        sendUserOTP,
        ...rest,
    };
};

export { useGetTwoFa, useGetSecretKey, useSendUserOTP };
