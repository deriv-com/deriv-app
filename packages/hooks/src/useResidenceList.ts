import { useQuery } from '@deriv/api';
import { TSocketRequestQueryOptions } from '@deriv/api/types';

/** A custom hook that gets the residence list. */
const useResidenceList = (options?: TSocketRequestQueryOptions<'residence_list'>) => {
    const { data, ...residence_list_rest } = useQuery('residence_list', {
        options: {
            staleTime: Infinity,
            ...options,
        },
    });

    return {
        /** The residence list */
        data: data?.residence_list ?? [],
        ...residence_list_rest,
    };
};

export default useResidenceList;
