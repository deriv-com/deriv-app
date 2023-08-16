import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

/**
 * Custom hook to get states list for a particular country.
 * @returns an object with the states list and the options to manage API response.
 */
const useStatesList = () => {
    const {
        client: { residence, is_authorize },
    } = useStore();

    const { data, ...rest } = useFetch('states_list', {
        // @ts-expect-error The `states_list` type from `@deriv/api-types` is not correct.
        // The type should be `string`, but it's an alias to string type.
        payload: { states_list: residence },
        options: { enabled: is_authorize },
    });

    return { data: data?.states_list ?? [], ...rest };
};

export default useStatesList;
