import { useMemo } from 'react';
import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

/** A custom hook to get the two factor authentication status. i.e. Whether it's enabled or not */
const useTwoFactorAuthenticationStatus = () => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('account_security', {
        payload: { totp_action: 'status' },
        options: { enabled: isSuccess },
    });
    const modifiedData = useMemo(() => {
        if (!data?.account_security) return undefined;
        const { is_enabled: isEnabled, secret_key: secretKey } = data.account_security.totp;
        return {
            ...data.account_security,
            /** Indicates whether 2-Factor authentication is enabled or disabled. */
            isEnabled: Boolean(isEnabled),
            /* The secret key for the 2-Factor authentication. **/
            secretKey,
        };
    }, [data?.account_security]);
    return {
        /** The two factor authentication status */
        data: modifiedData?.isEnabled,
        ...rest,
    };
};

export default useTwoFactorAuthenticationStatus;
