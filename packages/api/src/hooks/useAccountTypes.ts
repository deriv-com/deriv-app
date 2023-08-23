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

    return {
        /** Object of available account types for the current landing company */
        data: data?.get_account_types,
    };
};

export default useAccountTypes;
