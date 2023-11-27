import { useInfiniteQuery as _useInfiniteQuery } from '@tanstack/react-query';

import type {
    TSocketAcceptableProps,
    TSocketError,
    TSocketPaginatateableRequestCleaned,
    TSocketPaginateableEndpointNames,
    TSocketRequestInfiniteQueryOptions,
    TSocketRequestPayload,
    TSocketResponseData,
} from '../types';

import useAPI from './useAPI';
import { getQueryKeys } from './utils';

const useInfiniteQuery = <T extends TSocketPaginateableEndpointNames>(
    name: T,
    ...props: [TSocketAcceptableProps<T, true, 'useInfiniteQuery'>[number], { isPaginated: boolean }?]
) => {
    const prop = props?.[0];
    const payload = prop && 'payload' in prop ? (prop.payload as TSocketPaginatateableRequestCleaned<T>) : undefined;
    const options = prop && 'options' in prop ? (prop.options as TSocketRequestInfiniteQueryOptions<T>) : undefined;

    const isPaginated = props?.[1] ? props?.[1].isPaginated : true;
    const { send } = useAPI();

    const initial_offset = payload?.offset || 0;
    const limit = isPaginated ? payload?.limit ?? 50 : undefined;

    return _useInfiniteQuery<TSocketResponseData<T>, TSocketError<T>>(
        getQueryKeys(name, payload),

        ({ pageParam = 0 }) =>
            send(name, {
                ...payload,
                limit,
                offset: limit ? pageParam * limit + initial_offset : initial_offset,
            } as unknown as TSocketRequestPayload<T>),
        {
            ...options,
            getNextPageParam: options?.getNextPageParam ? options.getNextPageParam : (_lastPage, pages) => pages.length,
        }
    );
};

export default useInfiniteQuery;
