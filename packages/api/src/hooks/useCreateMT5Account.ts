import { useMemo } from 'react';
import useRequest from '../useRequest';
import useInvalidateQuery from '../useInvalidateQuery';

/** A custom hook to create MT5 accounts. */
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

    return {
        /** The response and the mutation of the create MT5 account API request */
        data: modified_data,
        ...rest,
    };
};

export default useCreateMT5Account;
