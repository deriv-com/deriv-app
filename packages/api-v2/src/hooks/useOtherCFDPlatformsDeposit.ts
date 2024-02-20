import { useCallback } from 'react';
import useMutation from '../useMutation';
import useInvalidateQuery from '../useInvalidateQuery';

type TPayload = Parameters<ReturnType<typeof useMutation<'trading_platform_deposit'>>['mutate']>[0]['payload'];

/** A custom hook for top-up of Other CFD Accounts */
const useOtherCFDPlatformsDeposit = () => {
    const invalidate = useInvalidateQuery();

    const {
        mutate: _mutate,
        mutateAsync: _mutateAsync,
        ...rest
    } = useMutation('trading_platform_deposit', {
        onSuccess: () => {
            invalidate('trading_platform_accounts');
        },
    });

    const mutate = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);
    const mutateAsync = useCallback((payload: TPayload) => _mutateAsync({ payload }), [_mutateAsync]);

    return {
        /** The mutation function that accepts a payload and sends it to the server */
        mutate,
        mutateAsync,
        ...rest,
    };
};

export default useOtherCFDPlatformsDeposit;
