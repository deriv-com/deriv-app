import { useMemo } from 'react';
import useFetch from '../useFetch';

/** A custom hook to get user settings (email, date of birth, address etc) */
const useSettings = () => {
    const { data, ...rest } = useFetch('get_settings');

    const modified_data = useMemo(() => ({ ...data?.get_settings }), [data?.get_settings]);

    return {
        /** User information and settings */
        data: modified_data,
        ...rest,
    };
};

export default useSettings;
