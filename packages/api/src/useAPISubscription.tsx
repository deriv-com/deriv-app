import { useEffect, useRef } from 'react';
import { useQueryClient } from 'react-query';
import { WS } from '@deriv/shared';
import { typeSafeSend, getQueryKeys } from './utils';
import { TSocketEndpointNames, TSocketAcceptableProps, TSocketResponse } from '../types';

const useAPISubscription = () => {
    const queryClient = useQueryClient();
    const websocket = useRef<WebSocket>();

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const data: TSocketResponse<TSocketEndpointNames> = JSON.parse(event.data);
            const queryKey = data.msg_type === 'tick' ? 'ticks' : data.msg_type;
            const queryKeys = getQueryKeys(data.echo_req, queryKey);

            if (data.error) {
                // update error
                // queryClient.setQueriesError(queryKeys, data.error) ?!
            }

            if (queryKey) queryClient.setQueriesData(queryKeys, data[queryKey]);
        };

        websocket.current = WS.getSocket();
        websocket.current?.addEventListener('message', handleMessage);

        return () => {
            websocket.current?.removeEventListener('message', handleMessage);
        };
    }, [queryClient]);

    return <T extends TSocketEndpointNames>(name: T, ...props: TSocketAcceptableProps<T>) => {
        typeSafeSend(name, ...props);
    };
};

export default useAPISubscription;
