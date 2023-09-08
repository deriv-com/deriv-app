import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import APIProvider from '../../APIProvider';
import useNotificationEvent from '../useNotificationEvent';

jest.mock('@deriv/shared', () => ({
    WS: {
        send: jest.fn().mockResolvedValueOnce({
            msg_type: 'notification_event',
            echo_req: {},
            notification_event: 1,
        }),
    },
}));

type TNotificationPayload = Parameters<ReturnType<typeof useNotificationEvent>['send']>[0];

describe('useNotificationEvent', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the notification event', async () => {
        const payload: TNotificationPayload = {
            category: 'authentication',
            event: 'poi_documents_uploaded',
            args: {
                documents: ['123', 'abc'],
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
        const { result, waitFor } = renderHook(() => useNotificationEvent(), { wrapper });

        result.current.send(payload);

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        expect(result.current.notification_event_status).toEqual(1);
    });
});
