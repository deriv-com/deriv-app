import { useMemo } from 'react';
import useQuery from '../useQuery';

/** A custom hook to get available account types for a specific landing company. */
const useAccountTypes = (landing_company?: string) => {
    const { data, ...rest } = useQuery('get_account_types', {
        payload: { company: landing_company },
        options: { enabled: Boolean(landing_company) },
    });

    // Add additional information to the account types response.
    const modified_account_types = useMemo(() => {
        if (!data?.get_account_types) return;

        return {
            ...data.get_account_types,
            /** Landing company for the account types */
            landing_company,
        };
    }, [data?.get_account_types, landing_company]);

    return {
        /** The account types response. */
        data: modified_account_types,
        ...rest,
    };
};

export default useAccountTypes;
