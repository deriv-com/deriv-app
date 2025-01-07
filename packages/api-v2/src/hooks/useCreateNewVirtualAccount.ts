import { useMemo } from 'react';

import useInvalidateQuery from '../useInvalidateQuery';
import useMutation from '../useMutation';

/** A custom hook that creates a new virtual trading account. */
const useCreateNewVirtualAccount = () => {
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useMutation('new_account_virtual', {
        onSuccess: () => {
            invalidate('account_list');
        },
    });

    // Add additional information to the new virtual trading account response.
    const modified_data = useMemo(() => {
        if (!data?.new_account_virtual) return;

        return { ...data?.new_account_virtual };
    }, [data]);

    return {
        /** The response and the mutation of the new account virtual API request */
        data: modified_data,
        ...rest,
    };
};

export default useCreateNewVirtualAccount;
