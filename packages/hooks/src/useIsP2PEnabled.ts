import { useEffect } from 'react';
import { useStore } from '@deriv/stores';
import { useFetch, useInvalidateQuery } from '@deriv/api';

const useIsP2PEnabled = () => {
    const { client } = useStore();
    const { is_authorize, loginid } = client;
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useFetch('website_status', { options: { enabled: is_authorize } });
    const is_p2p_enabled = data?.p2p_config?.disabled === 0;

    useEffect(() => {
        invalidate('website_status');
    }, [invalidate, loginid]);

    // if (!is_p2p_visible && window.location.pathname.endsWith(routes.cashier_p2p)) {
    //     this.root_store.common.routeTo(
    //         this.root_store.modules.cashier.account_prompt_dialog.last_location ?? routes.cashier_deposit
    //     );
    // }

    // const p2p_cookie = new (CookieStorage as any)('is_p2p_disabled');
    // p2p_cookie.set('is_p2p_disabled', !is_p2p_visible);

    return {
        ...rest,
        data: is_p2p_enabled,
    };
};

export default useIsP2PEnabled;
