import { useWS } from '@deriv/shared';
import { useCallback, useContext, useMemo } from 'react';
import APIContext from './APIContext';
import type {
    TSocketEndpointNames,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';

const useAPI = () => {
    const api = useContext(APIContext);
    const WS = useWS();

    if (!api) {
        throw new Error('useAPI must be used within APIProvider');
    }

    const server = useMemo(() => (api.is_standalone ? api.deriv_api : WS), [WS, api.deriv_api, api.is_standalone]);

    const send = useCallback(
        async <T extends TSocketEndpointNames>(
            name: T,
            payload?: TSocketRequestPayload<T>
        ): Promise<TSocketResponseData<T>> => {
            const response = await server.send({ [name]: 1, ...(payload || {}) });

            if (response.error) {
                throw response.error;
            }

            return response;
        },
        [server]
    );

    const subscribe = useCallback(
        <T extends TSocketSubscribableEndpointNames>(
            name: T,
            payload?: TSocketRequestPayload<T>
        ): {
            subscribe: (
                // The type will be handled by the `useSubscription` hook.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onData: (response: any) => void,
                // The type will be handled by the `useSubscription` hook.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (response: any) => void
            ) => { unsubscribe?: VoidFunction };
        } => server.subscribe({ [name]: 1, subscribe: 1, ...(payload || {}) }),
        [server]
    );

    return {
        send,
        subscribe,
    };
};

export default useAPI;
