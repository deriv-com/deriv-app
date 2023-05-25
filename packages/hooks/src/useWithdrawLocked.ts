import { useStore } from '@deriv/stores';

const useWithdrawLocked = () => {
    const { client } = useStore();
    const { account_status } = client;

    return account_status?.status?.some(status => status === 'withdrawal_locked');
};

export default useWithdrawLocked;
