import { useStore } from '@deriv/stores';
import useNeedPOI from './useNeedPOI';

const useWithdrawLocked = () => {
    const { client } = useStore();
    const { account_status } = client;
    const is_need_poi = useNeedPOI();

    const has_withdrawal_locked_status = account_status?.status?.some(status => status === 'withdrawal_locked');

    const is_withdrawal_locked = has_withdrawal_locked_status || is_need_poi;

    return is_withdrawal_locked;
};

export default useWithdrawLocked;
