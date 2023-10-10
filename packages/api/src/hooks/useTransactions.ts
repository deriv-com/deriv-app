import { useEffect, useMemo, useState } from 'react';
import useInfiniteQuery from '../useInfiniteQuery';
import { TSocketRequestPayload } from '../../types';
import useAuthorize from './useAuthorize';
import useInvalidateQuery from '../useInvalidateQuery';

type TFilter = NonNullable<TSocketRequestPayload<'statement'>['payload']>['action_type'];

/** A custom hook to get the summary of account transactions */
const useTransactions = () => {
    const { isSuccess } = useAuthorize();
    const [filter, setFilter] = useState<TFilter>();
    const invalidate = useInvalidateQuery();
    const { data, fetchNextPage, ...rest } = useInfiniteQuery('statement', {
        options: {
            enabled: isSuccess,
            getNextPageParam: (lastPage, pages) => {
                if (!lastPage?.statement?.count) return;

                return pages.length;
            },
        },
        payload: {
            action_type: filter,
        },
    });

    useEffect(() => {
        invalidate('statement');
    }, [filter, invalidate]);

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
        /** Filter the transactions by type */
        setFilter,
        ...rest,
    };
};

export default useTransactions;
