import { useStore } from '@deriv/stores';
import useNeedPOI from './useNeedPOI';

const useWithdrawLocked = () => {
    const { client } = useStore();
    const is_need_poi = useNeedPOI();

    if (!client.account_status?.status) {
        return false;
    }

    const status_name_locked = client.account_status?.status?.some(status_name => status_name === 'withdrawal_locked');

    return status_name_locked || is_need_poi;
};

export default useWithdrawLocked;
