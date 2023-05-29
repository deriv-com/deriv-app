import { useStore } from '@deriv/stores';

const useNeedPOI = () => {
    const { client } = useStore();
    const authentication = client.account_status?.authentication;

    return authentication?.needs_verification.includes('identity');
};

export default useNeedPOI;
