import { useCallback } from 'react';

import type {
    TSocketEndpointNames,
    TSocketPaginateableEndpointNames,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';
import { useAPIContext } from './APIProvider';
import WSClient from './ws-client/ws-client';

const useAPI = () => {
    const { derivAPI, wsClient } = useAPIContext();

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
        [derivAPI]
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
        } => derivAPI?.subscribe({ [name]: 1, subscribe: 1, ...(payload || {}) }),
        [derivAPI]
    );

    return {
        send,
        subscribe,
        derivAPI,
    };
};

export default useAPI;
