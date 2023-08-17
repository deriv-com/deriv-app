import { useMemo } from 'react';
import { useFetch } from '@deriv/api';

const useCashierLocked = () => {
    const { data } = useFetch('get_account_status');

    const is_cashier_locked = useMemo(
        () => data?.get_account_status?.status?.some(status => status === 'cashier_locked') || false,
        [data]
    );

    return is_cashier_locked;
};

export default useCashierLocked;
