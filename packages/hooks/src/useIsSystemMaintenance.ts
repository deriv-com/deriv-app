import { useStore } from '@deriv/stores';

const useIsSystemMaintenance = () => {
    const { client } = useStore();
    const { account_status } = client;

    if (!account_status?.cashier_validation) return false;
    return account_status.cashier_validation.some(validation => validation === 'system_maintenance');
};

export default useIsSystemMaintenance;
