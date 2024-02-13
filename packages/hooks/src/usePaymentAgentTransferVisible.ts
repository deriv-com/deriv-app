import { useFetch } from '@deriv/api';
import { WS } from '@deriv/shared';
import React from 'react';

const usePaymentAgentTransferVisible = async () => {
    const [is_authorized, setIsAuthorized] = React.useState(false);
    const { data, ...rest } = useFetch('get_settings', { options: { enabled: Boolean(is_authorized) } });

    React.useEffect(() => {
        const checkAuthorize = async () => {
            try {
                const authorized = await WS.wait('authorize');
                setIsAuthorized(authorized);
            } catch (error) {
                /* eslint-disable no-console */
                console.error('Error', error);
            }
        };
        checkAuthorize();
    }, []);

    const is_payment_agent_transfer_visible = Boolean(data?.get_settings?.is_authenticated_payment_agent);

    return {
        data: is_payment_agent_transfer_visible,
        ...rest,
    };
};

export default usePaymentAgentTransferVisible;
