import { useMemo } from 'react';
import useMutation from '../useMutation';
import useInvalidateQuery from '../useInvalidateQuery';

/** A custom hook that creates the Other CFD account. */
const useCreateOtherCFDAccount = () => {
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useMutation('trading_platform_new_account', {
        onSuccess: () => {
            invalidate('trading_platform_accounts');
            invalidate('service_token');
        },
    });

    // Add additional information to the create Other CFD account response.
    const modified_data = useMemo(() => {
        if (!data) return undefined;

        return { ...data };
    }, [data]);

    return {
        /** The response and the mutation of the create Other CFD account API request */
        data: modified_data,
        ...rest,
    };
};

export default useCreateOtherCFDAccount;
