import { useInvalidateQuery, useRequest } from '@deriv/api';
import { useMemo } from 'react';

/** A custom hook to create more wallets */
const useNewWalletCreation = () => {
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useRequest('new_account_wallet', {
        onSuccess: () => {
            invalidate('authorize');
            invalidate('balance');
        },
    });

    // Add extra information to the response.
    const modified_data = useMemo(() => ({ ...data }), [data]);

    return {
        data: modified_data,
        ...rest,
    };
};

export default useNewWalletCreation;
