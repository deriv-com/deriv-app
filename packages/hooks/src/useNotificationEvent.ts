import React from 'react';
import { useMutation } from '@deriv/api';
import { TSocketRequestPayload } from '@deriv/api/types';

type TNotificationEventPayload = TSocketRequestPayload<'notification_event'>['payload'];

/**
 * Hook to send notification event to the server
 * @name useNotificationEvent
 * @returns response, mutation function and other properties from useRequest hook
 */
const useNotificationEvent = () => {
    const { data, mutate, ...rest } = useMutation('notification_event');

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
