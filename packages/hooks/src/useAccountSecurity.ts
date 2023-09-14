import { useRequest } from '@deriv/api';
import React from 'react';

type TAccountSecurityPayload = NonNullable<
    NonNullable<Parameters<ReturnType<typeof useRequest<'account_security'>>['mutate']>[0]>['payload']
>;

/**
 * A custom hook that calls the `account_security` api. This call manages two-factor account authentication
 */

// const useAccountSecurity = () => {
//     const { mutateAsync, ...rest } = useRequest('account_security');

//     /**
//      * Makes an API call to send OTP entered by user.
//      * @name sendUserOTP
//      */
//     const sendUserOTP = React.useCallback(
//         (payload: TAccountSecurityPayload) => mutateAsync({ payload: { ...payload } }),
//         [mutateAsync]
//     );
//     /**
//      * Makes an API call to get response when status is generate.
//      * @name generateResponse
//      */
//     const generateResponse = React.useCallback(
//         () => mutateAsync({ payload: { totp_action: 'generate' } }),
//         [mutateAsync]
//     );

//     /**
//      * Makes an API call to get 2FA status.
//      * @name getTwoFAStatus
//      */
//     const getTwoFA = React.useCallback(() => mutateAsync({ payload: { totp_action: 'status' } }), [mutateAsync]);

//     return {
//         sendUserOTP,
//         generateResponse,
//         getTwoFA,
//         ...rest,
//     };

//     // const { data, mutateAsync, ...rest } = useRequest('account_security',{onSuccess:});
// };

const useAccountSecurity = () => {
    const { mutate, ...rest } = useRequest('account_security');
    return {
        mutate,
        ...rest,
    };
};

const useGetTwoFa = () => {
    const { data, mutate, ...rest } = useAccountSecurity();

    const getTwoFA = React.useCallback(() => mutate({ payload: { totp_action: 'status' } }), [mutate]);
    return {
        is_TwoFA_enabled: data?.account_security?.totp?.is_enabled,
        getTwoFA,
        ...rest,
    };
};

const useGetSecretKey = () => {
    const { data, mutate, ...rest } = useAccountSecurity();

    const getSecretKey = React.useCallback(() => mutate({ payload: { totp_action: 'generate' } }), [mutate]);
    return {
        // secret_key: data?.account_security?.totp?.secret_key,
        data,
        getSecretKey,
        ...rest,
    };
};

const useSendUserOTP = () => {
    const { data, mutate, ...rest } = useAccountSecurity();

    const sendUserOTP = React.useCallback((payload: TAccountSecurityPayload) => mutate({ payload }), [mutate]);
    return {
        is_TwoFA_enabled: data?.account_security?.totp?.is_enabled,
        sendUserOTP,
        ...rest,
    };
};

export { useGetTwoFa, useGetSecretKey, useSendUserOTP };
