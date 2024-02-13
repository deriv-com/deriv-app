import { useFetch } from '@deriv/api';
import { WS, isBot } from '@deriv/shared';
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
    const isPaymentAgentTransferVisible = Boolean(data?.get_settings?.is_authenticated_payment_agent);

    return {
        data: isPaymentAgentTransferVisible,
        ...rest,
    };
};

export default usePaymentAgentTransferVisible;
