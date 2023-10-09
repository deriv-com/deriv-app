import { useMemo } from 'react';

import useInfiniteQuery from '../useInfiniteQuery';

import useAuthorize from './useAuthorize';

/** A custom hook to get the summary of account transactions */
const useTransactions = () => {
    const { isSuccess } = useAuthorize();
    const { data, fetchNextPage, ...rest } = useInfiniteQuery('statement', {
        options: {
            enabled: isSuccess,
            getNextPageParam: (lastPage, pages) => {
                if (!lastPage?.statement?.count) return;

                return pages.length;
            },
        },
    });

    const flatten_data = useMemo(() => {
        if (!data?.pages?.length) return;

        return data?.pages?.flatMap(page => page?.statement?.transactions);
    }, [data?.pages]);

    const modified_data = useMemo(() => {
        if (!flatten_data?.length) return;

        return flatten_data?.map(transaction => ({
            ...transaction,
        }));
    }, [flatten_data]);

    return {
        /** List of account transactions */
        data: modified_data,
        /** Fetch the next page of transactions */
        fetchNextPage,
        ...rest,
    };
};

export default useTransactions;
