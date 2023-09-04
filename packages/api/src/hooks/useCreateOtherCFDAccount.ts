import { useMemo } from 'react';
import useRequest from '../useRequest';
import useInvalidateQuery from '../useInvalidateQuery';

/** A custom hook that creates the Other CFD account given account_type, platform. */
const useCreateOtherCFDAccount = () => {
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useRequest('trading_platform_new_account', {
        onSuccess: () => {
            invalidate('trading_platform_accounts');
        },
    });

    // Add additional information to the create Other CFD account response.
    const modified_data = useMemo(() => {
        if (!data) return undefined;

        return { ...data };
    }, [data]);

    return { data: modified_data, ...rest };
};

export default useCreateOtherCFDAccount;
