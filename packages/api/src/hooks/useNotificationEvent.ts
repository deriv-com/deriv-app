import React from 'react';
import useRequest from '../useRequest';
import useInvalidateQuery from '../useInvalidateQuery';
import { TSocketRequestPayload } from '../../types';

type TNotificationEventPayload = TSocketRequestPayload<'notification_event'>['payload'];

/**
 * Hook to send notification event to the server
 * @name useNotificationEvent
 * @returns response, mutation function and other properties from useRequest hook
 */
const useNotificationEvent = () => {
    const invalidate = useInvalidateQuery();
    const { data, mutate, ...rest } = useRequest('notification_event', {
        onSuccess: () => {
            invalidate('notification_event');
        },
    });

    /**
     * Function to send notification event to the server
     * @param payload - notification event payload
     */
    const send = React.useCallback((payload: TNotificationEventPayload) => mutate({ payload }), [mutate]);

    return {
        notification_event: data?.notification_event,
        send,
        ...rest,
    };
};

export default useNotificationEvent;
