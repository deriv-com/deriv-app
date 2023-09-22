import { useCallback, useMemo } from 'react';
import useRequest from '../useRequest';
import useInvalidateQuery from '../useInvalidateQuery';

type TPayload = Parameters<ReturnType<typeof useRequest<'trading_platform_new_account'>>['mutate']>[0]['payload'];

/** A custom hook that creates the Other CFD account. */
const useCreateOtherCFDAccount = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useRequest('trading_platform_new_account', {
        onSuccess: () => {
            invalidate('trading_platform_accounts');
            invalidate('service_token');
        },
    });

    /** The mutation of the create Other CFD account API request */
    const send = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);

    // Add additional information to the create Other CFD account response.
    const modified_data = useMemo(() => {
        if (!data) return undefined;

        return { ...data };
    }, [data]);

    return {
        /** The response and the mutation of the create Other CFD account API request */
        data: modified_data,
        /** The send request to create other CFD accounts */
        send,
        ...rest,
    };
};

export default useCreateOtherCFDAccount;
