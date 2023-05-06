import { useStore } from '@deriv/stores';

const useNeedPOI = () => {
    const { client } = useStore();
    const { account_status } = client;

    const is_need_poi = account_status?.authentication?.needs_verification.includes('identity') || false;

    return is_need_poi;
};

export default useNeedPOI;
