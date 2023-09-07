import { useCallback, useContext } from 'react';
import { useWS } from '@deriv/shared';
import APIContext from './APIContext';
import { send as legacy_send } from './utils';
import type { TSocketEndpointNames, TSocketRequestPayload, TSocketResponseData } from '../types';

const useAPI = () => {
    const api = useContext(APIContext);
    const WS = useWS();

    if (!api) {
        throw new Error('useAPI must be used within APIProvider');
    }

    const send = useCallback(
        async <T extends TSocketEndpointNames>(
            name: T,
            payload?: TSocketRequestPayload<T>
        ): Promise<TSocketResponseData<T>> => {
            const response = await api.deriv_api.send({ [name]: 1, ...(payload || {}) });

            if (response.error) {
                throw response.error;
            }

            return response;
        },
        [api]
    );

    return {
        send: api.is_standalone ? send : legacy_send,
        subscribe: api.is_standalone ? api.deriv_api.subscribe : WS.subscribe,
    };
};

export default useAPI;
