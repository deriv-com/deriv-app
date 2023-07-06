import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useAuthorize = () => {
    const { client } = useStore();
    const { accounts, loginid = '' } = client;

    return useFetch('authorize', {
        payload: { authorize: accounts[loginid]?.token || '' },
        options: { enabled: !!loginid, keepPreviousData: true },
    });
};

export default useAuthorize;
