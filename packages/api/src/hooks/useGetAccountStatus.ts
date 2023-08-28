import { useMemo } from 'react';
import useFetch from '../useFetch';

/** A hook that retrieves the account status   */
const useGetAccountStatus = () => {
    const { data: get_account_status_data, ...rest } = useFetch('get_account_status');

    // Add additional information to the authorize response.
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
        /** Account status details. */
        data: modified_account_status,
        ...rest,
    };
};

export default useGetAccountStatus;
