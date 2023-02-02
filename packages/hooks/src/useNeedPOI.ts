import { useStore } from '@deriv/stores';

const useNeedPOI = () => {
    const { client } = useStore();
    const { authentication } = client.account_status;

    return authentication?.needs_verification.includes('identity');
};

export default useNeedPOI;
