import { useCallback, useState } from 'react';
import useFetch from './useFetch';
import {
    TSocketAcceptableProps,
    TSocketRequestPayload,
    TSocketRequestQueryOptions,
    TSocketPaginateableEndpointNames,
} from '../types';

const usePaginatedFetch = <T extends TSocketPaginateableEndpointNames>(
    name: T,
    ...props: TSocketAcceptableProps<T, true>
) => {
    const prop = props?.[0];
    const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;
    const options = prop && 'options' in prop ? (prop.options as TSocketRequestQueryOptions<T>) : undefined;

    // @ts-expect-error The `limit` parameter is always present in
    // the `payload` for the paginateable endpoints.
    const limit: number = payload?.payload?.limit || 10;
    // @ts-expect-error The `offset` parameter is always present in
    // the `payload` for the paginateable endpoints.
    const [offset, setOffset] = useState<number>(payload?.payload?.offset || 0);

    // @ts-expect-error It's safe to ignore the TS error here since the
    // exact type of the payload is not determined at this point.
    const { remove, ...rest } = useFetch(name, {
        payload: { ...payload, offset, limit },
        options: { ...options, keepPreviousData: !!offset },
    });

    const loadMore = useCallback(() => setOffset(prev => prev + limit), [limit]);

    const reset = useCallback(() => {
        remove();
        setOffset(0);
    }, [remove]);

    return {
        ...rest,
        remove,
        loadMore,
        reset,
    };
};

export default usePaginatedFetch;
