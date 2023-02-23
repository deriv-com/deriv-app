import { useStore } from '@deriv/stores';
import useRealSTPAccount from './useRealSTPAccount';

const useNeedTNC = () => {
    const { client } = useStore();
    const { is_eu, is_tnc_needed } = client;
    const has_real_stp_account = useRealSTPAccount();
    const is_need_tnc = (is_eu || has_real_stp_account) && is_tnc_needed;

    return is_need_tnc;
};

export default useNeedTNC;
