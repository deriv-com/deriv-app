import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

const usePaymentAgentTransferVisible = () => {
    const { client } = useStore();
    const { is_authorize } = client;

    const { data, ...rest } = useFetch('get_settings', { options: { enabled: is_authorize } });

    const is_payment_agent_transfer_visible = Boolean(data?.get_settings?.is_authenticated_payment_agent);

    return {
        data: is_payment_agent_transfer_visible,
        ...rest,
    };
};

export default usePaymentAgentTransferVisible;
