import { useCallback } from 'react';
import useMutation from '../useMutation';

// type TPayload = Omit<
//     NonNullable<Parameters<ReturnType<typeof useMutation<'cashier'>>['mutate']>>[0]['payload'],
//     'cashier' | 'provider' | 'type'
// >;

// /** A custom hook that used for crypto withdrawal */
// const useCryptoWithdrawal = () => {
//     const { mutate: _mutate, ...rest } = useMutation('cashier');

//     const mutate = useCallback(
//         (payload: TPayload) =>
//             _mutate({ payload: { cashier: 'withdraw', provider: 'crypto', type: 'api', ...payload } }),
//         [_mutate]
//     );

//     return {
//         /** Function to request for crypto withdrawal */
//         mutate,
//         ...rest,
//     };
// };

// export default useCryptoWithdrawal;

type TPayload = NonNullable<
    Parameters<NonNullable<ReturnType<typeof useMutation<'notification_event'>>['mutate']>>[0]
>['payload'];

/** A custom hook to send notification event to backend about Onfido successful documents uploaded */
const useOnfidoNotificationEvent = () => {
    const { mutate: _mutate, ...rest } = useMutation('notification_event');

    const mutate = useCallback(
        (documentIds: string[]) =>
            _mutate({
                payload: {
                    category: 'authentication',
                    event: 'poi_documents_uploaded',
                    args: {
                        documents: documentIds,
                    },
                },
            }),
        [_mutate]
    );

    return {
        mutate,
        ...rest,
    };
};

export default useOnfidoNotificationEvent;
