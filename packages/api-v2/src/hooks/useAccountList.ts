import { useMemo } from 'react';
import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

/** A custom hook that gets the balance for all the user accounts. */
const useAccountList = () => {
    const { isSuccess } = useAuthorize();
    const { data: account_list_data, ...rest } = useQuery('account_list', {
        options: {
            enabled: isSuccess,
        },
    });

    // Add additional information to the balance data.
    const modified_account_list = useMemo(() => ({ ...account_list_data }), [account_list_data]);

    return {
        /** The balance response. */
        data: modified_account_list,
        ...rest,
    };
};

export default useAccountList;
