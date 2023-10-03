import { useMemo } from 'react';

import useQuery from '../useQuery';

/** A custom hook that gets the residence list. */
const useResidenceList = () => {
    const { data, ...residence_list_rest } = useQuery('residence_list');

    /** Modify the residence list data. */
    const modified_residence_list = useMemo(() => {
        if (!data || !data.residence_list) return [];

        return data.residence_list.map(residence => ({
            ...residence,
        }));
    }, [data]);

    return {
        /** The residence list */
        data: modified_residence_list,
        ...residence_list_rest,
    };
};

export default useResidenceList;
