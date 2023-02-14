import { useStore } from '@deriv/stores';

const useIsSystemMaintenance = () => {
    const { client } = useStore();
    const { account_status } = client;

    const is_system_maintenance =
        !!account_status?.cashier_validation &&
        account_status.cashier_validation.some(validation => validation === 'system_maintenance');

    return is_system_maintenance;
};

export default useIsSystemMaintenance;
