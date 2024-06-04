import { useCallback } from 'react';
import useMutation from '../useMutation';

type TPayload = Parameters<ReturnType<typeof useMutation<'verify_email'>>['mutate']>[0]['payload'];

/** A custom hook for verifying email address */
const useVerifyEmail = () => {
    const { mutate: _mutate, ...rest } = useMutation('verify_email');

    const mutate = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);

    return {
        /** The mutation function that accepts a payload and sends it to the server */
        mutate,
        ...rest,
    };
};

export default useVerifyEmail;
