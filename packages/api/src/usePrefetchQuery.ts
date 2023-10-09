import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
    TSocketAcceptableProps,
    TSocketEndpointNames,
    TSocketRequestPayload,
    TSocketRequestQueryOptions,
} from '../types';
import useAPI from './useAPI';
import { getQueryKeys } from './utils';

/** A custom hook to prefetch a query. */
const usePrefetchQuery = () => {
    const queryClient = useQueryClient();
    const { send } = useAPI();

    const prefetch = useCallback(
        <T extends TSocketEndpointNames>(name: T, ...props: TSocketAcceptableProps<T, true>) => {
            const prop = props?.[0];
            const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;
            const options = prop && 'options' in prop ? (prop.options as TSocketRequestQueryOptions<T>) : undefined;

            return queryClient.prefetchQuery(getQueryKeys(name, payload), () => send(name, payload), options);
        },
        [queryClient, send]
    );

    return prefetch;
};

export default usePrefetchQuery;
