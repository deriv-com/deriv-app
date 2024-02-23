import { useMemo } from 'react';
import useQuery from '../useQuery';
import useSettings from './useSettings';
import { TSocketRequestQueryOptions } from '../../types';

/** Custom hook to get states list for a particular country. */
type TStatesList = Exclude<NonNullable<ReturnType<typeof useSettings>['data']['residence' | 'country']>, undefined>;

const useStatesList = (country: TStatesList, options?: TSocketRequestQueryOptions<'states_list'>) => {
    const { data, ...rest } = useQuery('states_list', {
        // @ts-expect-error The `states_list` type from `@deriv/api-types` is not correct.
        // The type should be `string`, but it's an alias to string type.
        payload: { states_list: country },
        options,
    });

    const modified_states_list = useMemo(() => [...(data?.states_list ?? [])], [data?.states_list]);

    return {
        /** The states list for the given country. */
        data: modified_states_list,
        ...rest,
    };
};

export default useStatesList;
