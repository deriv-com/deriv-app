import { useStore } from '@deriv/stores';

const useCashierLocked = () => {
    const { client } = useStore();
    const { account_status } = client;

    const is_cashier_locked =
        !!account_status?.status && account_status.status.some(status_name => status_name === 'cashier_locked');

    return is_cashier_locked;
};

export default useCashierLocked;
