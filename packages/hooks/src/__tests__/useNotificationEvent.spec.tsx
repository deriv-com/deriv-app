import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useMutation } from '@deriv/api';
import APIProvider from '@deriv/api/src/APIProvider';
import useNotificationEvent from '../useNotificationEvent';

type TNotificationPayload = Parameters<ReturnType<typeof useNotificationEvent>['send']>[0];

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useMutation: jest.fn(),
}));

describe('useNotificationEvent', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the notification event', async () => {
        (useMutation as jest.Mock).mockReturnValueOnce({
            data: {
                notification_event: 1,
            },
            mutate: jest.fn(),
        });
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

        expect(result.current.notification_event).toEqual(1);
    });
});
