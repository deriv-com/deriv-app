import { useCallback, useState } from 'react';

import type {
    TSocketAcceptableProps,
    TSocketPaginateableEndpointNames,
    TSocketRequestPayload,
    TSocketRequestQueryOptions,
} from '../types';

import useQuery from './useQuery';

const usePaginatedFetch = <T extends TSocketPaginateableEndpointNames>(
    name: T,
    ...props: TSocketAcceptableProps<T, true>
) => {
    const prop = props?.[0];
    const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;
    const options = prop && 'options' in prop ? (prop.options as TSocketRequestQueryOptions<T>) : undefined;

    const limit: number = payload?.payload?.limit || 10;
    const [offset, setOffset] = useState<number>(payload?.payload?.offset || 0);

    // @ts-expect-error It's safe to ignore the TS error here since the
    // exact type of the payload is not determined at this point.
    const { remove, ...rest } = useQuery(name, {
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
