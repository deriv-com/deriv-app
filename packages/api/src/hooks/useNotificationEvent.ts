import React from 'react';
import useRequest from '../useRequest';
import useInvalidateQuery from '../useInvalidateQuery';
import { TSocketRequestPayload } from '../../types';

type TNotificationEventPayload = TSocketRequestPayload<'notification_event'>['payload'];

const useNotificationEvent = () => {
    const invalidate = useInvalidateQuery();
    const { data, mutate, ...rest } = useRequest('notification_event', {
        onSuccess: () => {
            invalidate('mt5_login_list');
        },
    });

    const send = React.useCallback((payload: TNotificationEventPayload) => mutate({ payload }), [mutate]);

    return {
        notification_event_status: data?.notification_event,
        send,
        ...rest,
    };
};

export default useNotificationEvent;
