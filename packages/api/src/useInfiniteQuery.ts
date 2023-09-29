import { useInfiniteQuery as _useInfiniteQuery } from '@tanstack/react-query';
import useAPI from './useAPI';
import type {
    TSocketAcceptableProps,
    TSocketPaginateableEndpointNames,
    TSocketRequestInfiniteQueryOptions,
    TSocketRequestPayload,
} from '../types';
import { getQueryKeys } from './utils';

const useInfiniteQuery = <T extends TSocketPaginateableEndpointNames>(
    name: T,
    ...props: TSocketAcceptableProps<T, true, 'useInfiniteQuery'>
) => {
    const prop = props?.[0];
    const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;
    const options = prop && 'options' in prop ? (prop.options as TSocketRequestInfiniteQueryOptions<T>) : undefined;
    const { send } = useAPI();

    // @ts-expect-error The `offset` parameter is always present in the `payload` for the paginateable endpoints.
    const initial_offset = payload?.offset || 0;
    // @ts-expect-error The `limit` parameter is always present in the `payload` for the paginateable endpoints.
    const limit = payload?.limit || 50;

    return _useInfiniteQuery(
        getQueryKeys(name, payload),

        ({ pageParam = 0 }) =>
            // @ts-expect-error The `limit` and `offset` parameter is always present in the `payload` for the paginateable endpoints.
            send(name, {
                ...payload,
                limit,
                offset: pageParam * limit + initial_offset,
            }),
        {
            ...options,
            getNextPageParam: options?.getNextPageParam ? options.getNextPageParam : (_lastPage, pages) => pages.length,
        } as TSocketRequestInfiniteQueryOptions<T>
    );
};

export default useInfiniteQuery;
