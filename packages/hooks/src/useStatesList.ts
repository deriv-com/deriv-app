import { useFetch } from '@deriv/api';
/**
 * Custom hook to get states list for a particular country.
 * @returns an object with the states list and the options to manage API response.
 */
const useStatesList = (country: string) => {
    const { data, ...rest } = useFetch('states_list', {
        // @ts-expect-error The `states_list` type from `@deriv/api-types` is not correct.
        // The type should be `string`, but it's an alias to string type.
        payload: { states_list: country },
    });

    return { ...rest, data: data?.states_list ?? [] };
};

export default useStatesList;
