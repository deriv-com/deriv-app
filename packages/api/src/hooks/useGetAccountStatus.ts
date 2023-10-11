import { useMemo } from 'react';
import useFetch from '../useFetch';

/** A custom hook to retrieves the account status for the current user. */
const useGetAccountStatus = () => {
    const { data: get_account_status_data, ...rest } = useFetch('get_account_status');

    // Add additional information to the account status response.
    const modified_account_status = useMemo(() => {
        if (!get_account_status_data?.get_account_status) return;

        return {
            ...get_account_status_data.get_account_status,
            /** Indicates whether the client should be prompted to authenticate their account. */
            should_prompt_client_to_authenticate: Boolean(
                get_account_status_data.get_account_status.prompt_client_to_authenticate
            ),
        };
    }, [get_account_status_data?.get_account_status]);

    return {
        /** The account status response. */
        data: modified_account_status,
        ...rest,
    };
};

export default useGetAccountStatus;
