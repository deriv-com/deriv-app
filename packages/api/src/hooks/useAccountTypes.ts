import { useMemo } from 'react';
import useFetch from '../useFetch';

/**
 * A custom hook to get available account types for a specific landing company
 *
 *  @param landing_company {string} - The landing company shortcode
 */
const useAccountTypes = (landing_company?: string) => {
    const { data } = useFetch('get_account_types', {
        payload: { company: landing_company },
        options: { enabled: Boolean(landing_company) },
    });

    const modified_data = useMemo(() => {
        if (!data?.get_account_types) return;

        return {
            /** List of available account types */
            ...data.get_account_types,
            /** Landing company for the account types */
            landing_company,
        };
    }, [data?.get_account_types]);

    return {
        /** Object of available account types for the current landing company */
        data: modified_data,
    };
};

export default useAccountTypes;
