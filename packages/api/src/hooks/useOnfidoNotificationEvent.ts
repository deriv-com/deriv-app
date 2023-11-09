import { useCallback } from 'react';
import useMutation from '../useMutation';

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
