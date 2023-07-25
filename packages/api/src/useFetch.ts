import { useQuery } from '@tanstack/react-query';
import { getQueryKeys, send } from './utils';
import { queryClient } from './APIProvider';
import type {
    TSocketAcceptableProps,
    TSocketEndpointNames,
    TSocketRequestPayload,
    TSocketRequestQueryOptions,
    TSocketResponseData,
} from '../types';

const AUTH_REQUIRED_ENDPOINTS = ['balance'];

const useFetch = <T extends TSocketEndpointNames>(name: T, ...props: TSocketAcceptableProps<T, true>) => {
    const prop = props?.[0];
    const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;
    const options = prop && 'options' in prop ? (prop.options as TSocketRequestQueryOptions<T>) : undefined;

    let enabled = true;

    const accounts = JSON.parse(localStorage.getItem('client.accounts') || '{}');
    const active_loginid = localStorage.getItem('active_loginid');
    const current_token = accounts?.[active_loginid || '']?.token;

    if (AUTH_REQUIRED_ENDPOINTS.includes(name)) {
        const state = queryClient.getQueryState<TSocketResponseData<'authorize'>>([
            'authorize',
            JSON.stringify({ authorize: current_token }),
        ]);
        enabled = Boolean(state?.data?.authorize);
    }

    return useQuery<TSocketResponseData<T>, unknown>(getQueryKeys(name, payload), () => send(name, payload), {
        ...options,
        enabled: options?.enabled ?? enabled,
    });
};

export default useFetch;
