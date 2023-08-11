import { useFetch } from '@deriv/api';

const useCashierLocked = () => {
    const { data } = useFetch('get_account_status');

    const is_cashier_locked = data?.get_account_status?.status?.some(status => status === 'cashier_locked') || false;

    return is_cashier_locked;
};

export default useCashierLocked;
