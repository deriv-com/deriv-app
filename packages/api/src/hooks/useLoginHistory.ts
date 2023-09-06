import { useMemo } from 'react';
import { getLoginHistoryFormattedData } from '@deriv/utils';
import useFetch from '../useFetch';

export type TData = {
    id: number;
    date: string;
    action: string;
    browser: string;
    ip: string;
    status: string;
}[];

/** Retrieve a summary of login history for user.*/
const useLoginHistory = (is_authorize: boolean) => {
    const { data, ...rest } = useFetch('login_history', {
        payload: { limit: 50 },
        options: { enabled: is_authorize },
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
