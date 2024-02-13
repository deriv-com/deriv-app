import { useFetch } from '@deriv/api';
import { WS } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { useEffect, useState } from 'react';

const usePaymentAgentTransferVisible = () => {
    const { client } = useStore();
    const { is_authorize } = client;
    const [is_authorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuthorize = async () => {
            try {
                const authorized = await WS.wait('authorize');
                if (authorized) setIsAuthorized(is_authorize);
            } catch (error) {
                console.error('Error while authorizing:', error); // eslint-disable-line
            }
        };

        checkAuthorize();
    }, [is_authorize]);

    const { data, ...rest } = useFetch('get_settings', { options: { enabled: Boolean(is_authorized) } });
    const is_payment_agent_transfer_visible = Boolean(data?.get_settings?.is_authenticated_payment_agent);

    return {
        data: is_payment_agent_transfer_visible,
        ...rest,
    };
};

export default usePaymentAgentTransferVisible;
