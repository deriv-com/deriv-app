import { useFetch } from '@deriv/api';

const usePaymentAgentTransferVisible = () => {
    const { data, ...rest } = useFetch('get_settings');

    const is_payment_agent_transfer_visible = Boolean(data?.get_settings?.is_authenticated_payment_agent);

    return {
        data: is_payment_agent_transfer_visible,
        ...rest,
    };
};

export default usePaymentAgentTransferVisible;
