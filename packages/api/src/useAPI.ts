import { useCallback, useContext, useEffect, useState } from 'react';

import type {
    TSocketEndpointNames,
    TSocketPaginateableEndpointNames,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';

import APIContext from './APIContext';

const useAPI = () => {
    const api = useContext(APIContext);
    const [isReady, setIsReady] = useState<boolean>(api?.get()?.connection?.readyState === 1);

    useEffect(() => {
        if ((api?.get()?.connection?.readyState === 1) !== isReady) {
            setIsReady(api?.get()?.connection?.readyState === 1);
        }
    }, [api, isReady]);

    const send = useCallback(
        async <T extends TSocketEndpointNames | TSocketPaginateableEndpointNames = TSocketEndpointNames>(
            name: T,
            payload?: TSocketRequestPayload<T>
        ): Promise<TSocketResponseData<T>> => {
            const response = await api?.send({ [name]: 1, ...(payload || {}) });

            if (response.error) {
                throw response.error;
            }

            return response;
        },
        [api]
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
        } => api?.subscribe({ [name]: 1, subscribe: 1, ...(payload || {}) }),
        [api]
    );

    return {
        send,
        subscribe,
        isReady,
    };
};

export default useAPI;
