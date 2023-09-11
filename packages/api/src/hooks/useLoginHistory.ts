import { useMemo } from 'react';
import { getLoginHistoryFormattedData } from '@deriv/utils';
import useAuthorize from './useAuthorize';
import useFetch from '../useFetch';

/** A custom hook to retrieve a summary of login history for user.*/
const useLoginHistory = () => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useFetch('login_history', {
        payload: { limit: 50 },
        options: { enabled: isSuccess },
    });

    /** Adding aditional properties to the response*/
    const modified_login_history = useMemo(
        () => ({
            ...data?.login_history,
            formatted_data: getLoginHistoryFormattedData(data?.login_history || []),
        }),
        [data?.login_history]
    );

    return {
        /** Returning login history from useFetch('login history') */
        data: modified_login_history,
        ...rest,
    };
};

export default useLoginHistory;
