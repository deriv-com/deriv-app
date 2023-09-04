import { useMemo } from 'react';
import useRequest from '../useRequest';
import useInvalidateQuery from '../useInvalidateQuery';

/** A custom hook that creates the MT5 account given account_type, platform. */
const useCreateMT5Account = () => {
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useRequest('mt5_new_account', {
        onSuccess: () => {
            invalidate('mt5_login_list');
        },
    });

    // Add additional information to the create MT5 account response.
    const modified_data = useMemo(() => {
        if (!data?.mt5_new_account) return undefined;

        return { ...data?.mt5_new_account };
    }, [data]);

    return { data: modified_data, ...rest };
};

export default useCreateMT5Account;
