import { useStore } from '@deriv/stores';
import useNeedPOI from './useNeedPOI';

const useWithdrawLocked = () => {
    const { client } = useStore();
    const is_need_poi = useNeedPOI();

    if (!client.account_status?.status) return false;
    return client.is_withdrawal_lock || is_need_poi;
};

export default useWithdrawLocked;
