import { useMemo } from 'react';
import { useFetch } from '@deriv/api';

const useAccountStatus = () => {
    const { data, ...rest } = useFetch('get_account_status');

    const account_status = useMemo(() => data?.get_account_status, [data?.get_account_status]);
    return {
        data: account_status,
        ...rest,
    };
};

export default useAccountStatus;
