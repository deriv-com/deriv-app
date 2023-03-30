import { useStore } from '@deriv/stores';

const useNeedPOI = () => {
    const { client } = useStore();
    const { authentication } = client.account_status;
    const is_need_poi = authentication?.needs_verification.includes('identity');

    return is_need_poi;
};

export default useNeedPOI;
