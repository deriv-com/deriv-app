import { useCallback } from 'react';

import type {
    TSocketEndpointNames,
    TSocketPaginateableEndpointNames,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';
import { useAPIContext } from './APIProvider';

const useAPI = () => {
    const { wsClient, connection } = useAPIContext();

    const send = useCallback(
        async <T extends TSocketEndpointNames | TSocketPaginateableEndpointNames = TSocketEndpointNames>(
            name: T,
            payload?: TSocketRequestPayload<T>
        ): Promise<TSocketResponseData<T>> => {
            // casting needed as there is genuine type mismatch which have been there already
            const response = await wsClient?.request<T>(
                name,
                payload as unknown as TSocketRequestPayload<T>['payload']
            );

            // if (response.error) {
            //     throw response.error;
            // }
            return response;
        },
        [wsClient]
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
        } => {
            return {
                subscribe(onData: (response: any) => void, onError: (response: any) => void) {
                    const subscribeResponse = wsClient?.subscribe(name, payload, onData);
                    const unsubscribe = () => {
                        return subscribeResponse?.then(response => {
                            return response.unsubscribe?.();
                        });
                    };

                    return {
                        unsubscribe,
                    };
                },
            };
        },
        [wsClient]
    );

    return {
        send,
        subscribe,
        connection,
    };
};

export default useAPI;
