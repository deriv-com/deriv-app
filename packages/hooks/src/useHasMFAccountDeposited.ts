import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useHasMFAccountDeposited = () => {
    const { client } = useStore();
    const { is_authorize } = client;
    const expected_status = ['unwelcome', 'withdrawal_locked', 'cashier_locked'];

    const hasDeposited = (status?: string[]) => {
        return status?.some(status => expected_status.includes(status)) ?? false;
    };

    const { data } = useFetch('get_account_status', {
        options: {
            enabled: is_authorize,
            refetchInterval: response => (hasDeposited(response?.get_account_status?.status) ? false : 2000),
        },
    });

    const status = data?.get_account_status?.status;

    const has_mf_account_deposited = hasDeposited(status);

    return has_mf_account_deposited;
};

export default useHasMFAccountDeposited;
