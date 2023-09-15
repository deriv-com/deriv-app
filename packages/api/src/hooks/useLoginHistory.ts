import { useMemo } from 'react';
import { getLoginHistoryFormattedData } from '@deriv/utils';
import useAuthorize from './useAuthorize';
import useFetch from '../useFetch';
import useRequest from '../useRequest';

type TUseLoginHistoryPayload = NonNullable<
    NonNullable<NonNullable<Parameters<ReturnType<typeof useRequest<'login_history'>>['mutate']>>[0]>['payload']
>;

/** A custom hook to retrieve a summary of login history for user.*/
const useLoginHistory = (payload?: TUseLoginHistoryPayload) => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useFetch('login_history', {
        payload,
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
