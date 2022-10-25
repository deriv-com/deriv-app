import { useStore } from './useStore';

const useRealSTPAccount = () => {
    const { client } = useStore();
    const { mt5_login_list } = client;
    const has_real_stp_account = mt5_login_list.some(
        item => item.account_type === 'real' && item.sub_account_type === 'financial_stp'
    );

    return has_real_stp_account;
};

export default useRealSTPAccount;
