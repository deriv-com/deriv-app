import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useAuthorizeResponse = () => {
    const { client } = useStore();
    const { accounts, loginid = '' } = client;
    const { data, ...rest } = useFetch('authorize', {
        payload: { authorize: accounts[loginid]?.token || '' },
        options: { enabled: !!loginid },
    });
    return { data, ...rest };
};

export default useAuthorizeResponse;
