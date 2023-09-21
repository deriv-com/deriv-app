import { useCallback } from 'react';
import useRequest from '../useRequest';
import useInvalidateQuery from '../useInvalidateQuery';

type TPayload = NonNullable<
    NonNullable<Parameters<ReturnType<typeof useRequest<'new_account_real'>>['mutate']>>[0]
>['payload'];

/** A custom hook that creates a new real trading account. */
const useCreateNewRealAccount = () => {
    const invalidate = useInvalidateQuery();
    const { mutate: _mutate, ...rest } = useRequest('new_account_real', {
        onSuccess: () => {
            invalidate('authorize');
        },
    });

    const mutate = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);

    return {
        /** The balance response. */
        mutate,
        ...rest,
    };
};

export default useCreateNewRealAccount;
