import { useEffect, useState } from 'react';
import useFetch from './useFetch';
import {
    TSocketEndpointNames,
    TSocketAcceptableProps,
    TSocketRequestPayload,
    TSocketRequestQueryOptions,
} from '../types';

const usePaginatedFetch = <T extends TSocketEndpointNames>(name: T, ...props: TSocketAcceptableProps<T, true>) => {
    const limit = 10;
    const [offset, setOffset] = useState(0);
    const [should_reset, setShouldReset] = useState(false);

    const prop = props?.[0];
    const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;
    const options = prop && 'options' in prop ? (prop.options as TSocketRequestQueryOptions<T>) : undefined;

    const nextPage = () => {
        setOffset(prev => prev + limit);
    };

    const resetPages = () => {
        setShouldReset(true);
        setOffset(0);
    };

    useEffect(() => {
        if (should_reset && offset === 0) setShouldReset(false);
    }, [should_reset, offset]);

    // @ts-expect-error aaa
    const fetcher = useFetch(name, {
        payload: {
            ...payload,
            offset,
            limit,
        },
        options: {
            ...options,
            keepPreviousData: !should_reset,
        },
    });

    return {
        ...fetcher,
        nextPage,
        resetPages,
    };
};

export default usePaginatedFetch;
