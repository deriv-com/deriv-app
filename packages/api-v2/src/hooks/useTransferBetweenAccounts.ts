import { useCallback } from 'react';
import useMutation from '../useMutation';

type TPayload = NonNullable<
    NonNullable<Parameters<ReturnType<typeof useMutation<'transfer_between_accounts'>>['mutate']>[0]>['payload']
>;

/** A custom hook used to transfer money between client accounts */
const useTransferBetweenAccounts = () => {
    const { mutate: _mutate, mutateAsync: _mutateAsync, ...rest } = useMutation('transfer_between_accounts');

    const mutate = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);
    const mutateAsync = useCallback((payload: TPayload) => _mutateAsync({ payload }), [_mutateAsync]);

    return {
        /** The mutation function that accepts a payload and sends it to the server */
        mutate,
        mutateAsync,
        ...rest,
    };
};

export default useTransferBetweenAccounts;
