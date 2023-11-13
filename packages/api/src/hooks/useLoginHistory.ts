import { useMemo } from 'react';
import { getLoginHistoryFormattedData } from '@deriv/utils';
import useAuthorize from './useAuthorize';
import useMutation from '../useMutation';
import useQuery from '../useQuery';

type TUseLoginHistoryPayload = NonNullable<
    NonNullable<NonNullable<Parameters<ReturnType<typeof useMutation<'login_history'>>['mutate']>>[0]>['payload']
>;

/** A custom hook to retrieve a summary of login history for user.*/
const useLoginHistory = (payload?: TUseLoginHistoryPayload) => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('login_history', {
        payload,
        options: { enabled: isSuccess },
    });

    /** Adding aditional properties to the response*/
    const modified_login_history = useMemo(
        () => ({
            ...data?.login_history,
            formatted_data: getLoginHistoryFormattedData(data?.login_history ?? []),
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
