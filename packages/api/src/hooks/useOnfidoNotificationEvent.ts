import useQuery from '../useQuery';

/** A custom hook to send notification event to backend about Onfido successful documents uploaded */
const useOnfidoNotificationEvent = (documents: string[]) => {
    const { data, ...rest } = useQuery('notification_event', {
        payload: {
            category: 'authentication',
            event: 'poi_documents_uploaded',
            args: {
                documents,
            },
        },
        options: {
            enabled: Boolean(documents.length),
        },
    });

    return {
        data: data?.notification_event,
        ...rest,
    };
};

export default useOnfidoNotificationEvent;
