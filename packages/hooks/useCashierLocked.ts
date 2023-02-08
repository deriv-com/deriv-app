import { useStore } from '@deriv/stores';

const useCashierLocked = () => {
    const { client } = useStore();
    const { account_status } = client;

    if (!account_status?.status) return false;
    return account_status.status.some(status_name => status_name === 'cashier_locked');
};

export default useCashierLocked;
