import { useCallback, useMemo } from 'react';
import useMutation from '../useMutation';
import useInvalidateQuery from '../useInvalidateQuery';

type TPayload = NonNullable<Parameters<ReturnType<typeof useMutation<'account_security'>>['mutate']>[0]>['payload'];

/** A custom hook perform mutations for generating, enabling, and disabling 2FA */
const useTwoFactorAuthentication = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useMutation('account_security', {
        onSuccess: () => {
            invalidate('account_security');
        },
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
    const mutate = useCallback(
        (payload: TPayload) => {
            _mutate({ payload });
        },
        [_mutate]
    );
    return {
        /** 2-Factor authentication data. */
        data: modifiedData,
        mutate,
        ...rest,
    };
};

export default useTwoFactorAuthentication;
