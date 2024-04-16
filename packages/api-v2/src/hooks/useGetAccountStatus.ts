import { useMemo } from 'react';
import useQuery from '../useQuery';

/** A custom hook to retrieves the account status for the current user. */
const useGetAccountStatus = () => {
    const { data: get_account_status_data, ...rest } = useQuery('get_account_status');

    // Add additional information to the account status response.
    const modified_account_status = useMemo(() => {
        if (!get_account_status_data?.get_account_status) return;

        const { prompt_client_to_authenticate, p2p_status } = get_account_status_data.get_account_status;

        return {
            ...get_account_status_data.get_account_status,
            /** Indicates whether the client should be prompted to authenticate their account. */
            should_prompt_client_to_authenticate: Boolean(prompt_client_to_authenticate),
            /** Indicates whether the client is a P2P user. */
            is_p2p_user: Boolean(p2p_status !== 'none' && p2p_status !== 'perm_ban'),
        };
    }, [get_account_status_data?.get_account_status]);

    return {
        /** The account status response. */
        data: modified_account_status,
        ...rest,
    };
};

export default useGetAccountStatus;
