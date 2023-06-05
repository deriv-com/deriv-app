import { useStore } from '@deriv/stores';

const useCashierLocked = () => {
    const { client } = useStore();
    const { account_status } = client;

    const is_cashier_locked = account_status.status?.some(status => status === 'cashier_locked') || false;

    return is_cashier_locked;
};

export default useCashierLocked;
