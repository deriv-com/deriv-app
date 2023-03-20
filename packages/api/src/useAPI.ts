import { useEffect } from 'react';
import { useQuery } from 'react-query';
// import useAPISubscription from './useAPISubscription';
import { getQueryKeys, typeSafeSend } from './utils';
import { TSocketEndpointNames, TSocketAcceptableProps, TSocketResponseData } from '../types';

const useAPI = <T extends TSocketEndpointNames>(name: T, ...props: TSocketAcceptableProps<T>) => {
    const queryKey = getQueryKeys(props[0] || {}, name);
    // const send = useAPISubscription();
    const query = useQuery<TSocketResponseData<T>, unknown>(queryKey, () => typeSafeSend(name, ...props));

    useEffect(() => {
        return () => {
            // Unsubscribe from the query
        };
    }, []);

    return {
        // send: (..._props: TSocketAcceptableProps<T>) => send(name, ..._props),
        subscribe: () => {
            // Subscribe to the query
        },
        unsubscribe: () => {
            // Unsubscribe from the query
        },
        ...query,
    };
};

export default useAPI;
