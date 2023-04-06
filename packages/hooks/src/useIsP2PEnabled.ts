// import { useEffect } from 'react';
// import { useStore } from '@deriv/stores';
import { useFetch } from '@deriv/api';
// import { useInvalidateQuery } from '@deriv/api';

const useIsP2PEnabled = () => {
    // const { client } = useStore();
    // const { is_logged_in } = client;
    // const invalidate = useInvalidateQuery();
    const { data, ...rest } = useFetch('website_status');
    const is_p2p_enabled = data?.p2p_config?.disabled === 0;

    // useEffect(() => {
    //     invalidate('website_status');
    // }, [invalidate, is_logged_in]);

    // const p2p_cookie = new (CookieStorage as any)('is_p2p_disabled');
    // p2p_cookie.set('is_p2p_disabled', !is_p2p_visible);

    return {
        ...rest,
        data: is_p2p_enabled,
    };
};

export default useIsP2PEnabled;
