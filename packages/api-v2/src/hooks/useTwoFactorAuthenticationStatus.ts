import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

/** A custom hook to get the two factor authentication status. i.e. Whether it's enabled or not */
const useTwoFactorAuthenticationStatus = () => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('account_security', {
        payload: { totp_action: 'status' },
        options: { enabled: isSuccess },
    });
    return {
        /** The two factor authentication status */
        data: data?.account_security ? Boolean(data?.account_security?.totp.is_enabled) : undefined,
        ...rest,
    };
};

export default useTwoFactorAuthenticationStatus;
