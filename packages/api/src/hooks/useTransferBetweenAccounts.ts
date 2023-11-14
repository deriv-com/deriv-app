import { useCallback } from 'react';
import useMutation from '../useMutation';

type TPayload = NonNullable<
    NonNullable<Parameters<ReturnType<typeof useMutation<'transfer_between_accounts'>>['mutate']>[0]>['payload']
>;

/** A custom hook used to transfer money between client accounts */
const useTransferBetweenAccounts = () => {
    const { mutate: _mutate, ...rest } = useMutation('transfer_between_accounts');

    const mutate = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);

    return {
        /** The mutation function that accepts a payload and sends it to the server */
        mutate,
        ...rest,
    };
};

export default useTransferBetweenAccounts;
