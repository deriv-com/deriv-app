import { useEffect, useState } from 'react';
import useFetch from './useFetch';
import {
    TSocketEndpointNames,
    TSocketAcceptableProps,
    TSocketRequestPayload,
    TSocketRequestQueryOptions,
} from '../types';

const usePaginatedFetch = <T extends TSocketEndpointNames>(
    name: T,
    query_key: string,
    ...props: TSocketAcceptableProps<T, true>
) => {
    const limit = 10;
    const [offset, setOffset] = useState(0);

    const prop = props?.[0];
    const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;
    const options = prop && 'options' in prop ? (prop.options as TSocketRequestQueryOptions<T>) : undefined;

    useEffect(() => setOffset(0), [query_key]);

    const nextPage = () => setOffset(prev => prev + limit);

    // @ts-expect-error aaa
    const fetcher = useFetch(name, {
        payload: {
            ...payload,
            offset,
            limit,
        },
        options: {
            ...options,
            keepPreviousData: true,
        },
    });

    return {
        ...fetcher,
        nextPage,
    };
};

export default usePaginatedFetch;
