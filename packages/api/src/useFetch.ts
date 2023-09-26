import { useQuery } from '@tanstack/react-query';
import { isAuthorized, getQueryKeys, send } from './utils';

import type {
    TSocketAcceptableProps,
    TSocketEndpointNames,
    TSocketRequestPayload,
    TSocketRequestQueryOptions,
    TSocketResponseData,
} from '../types';

const useFetch = <T extends TSocketEndpointNames>(name: T, ...props: TSocketAcceptableProps<T, true>) => {
    const prop = props?.[0];
    const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;
    const options = prop && 'options' in prop ? (prop.options as TSocketRequestQueryOptions<T>) : undefined;

    const is_authorized = isAuthorized(name);

    return useQuery<TSocketResponseData<T>, unknown>(getQueryKeys(name, payload), () => send(name, payload), {
        ...options,
        enabled: is_authorized && (options?.enabled || true),
    });
};

export default useFetch;
