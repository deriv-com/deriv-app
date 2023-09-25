import { useMemo } from 'react';
import useRequest from '../useRequest';
import useInvalidateQuery from '../useInvalidateQuery';

/** A custom hook that creates a new real trading account. */
const useCreateNewRealAccount = () => {
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useRequest('new_account_real', {
        onSuccess: () => {
            invalidate('authorize');
        },
    });

    // Add additional information to the new real trading account response.
    const modified_data = useMemo(() => {
        if (!data?.new_account_real) return undefined;

        return { ...data?.new_account_real };
    }, [data]);

    return {
        /** The response and the mutation of the new account real API request */
        data: modified_data,
        ...rest,
    };
};

export default useCreateNewRealAccount;
