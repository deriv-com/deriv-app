import { useStore } from '@deriv/stores';
import useNeedPOI from './useNeedPOI';

const useWithdrawLocked = () => {
    const { client } = useStore();
    const is_need_poi = useNeedPOI();

    const has_withdrawal_locked_status = client.account_status?.status?.some(status => status === 'withdrawal_locked');

    return has_withdrawal_locked_status || is_need_poi;
};

export default useWithdrawLocked;
