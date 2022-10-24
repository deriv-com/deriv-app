import { useStore } from './useStore';

const useNeedAuthentication = () => {
    const { client } = useStore();
    const { is_authentication_needed, is_eu } = client;
    const is_need_authentication = is_authentication_needed && is_eu;

    return is_need_authentication;
};

export default useNeedAuthentication;
