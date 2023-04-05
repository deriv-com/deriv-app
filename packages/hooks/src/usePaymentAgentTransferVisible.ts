import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

const usePaymentAgentTransferVisible = () => {
    const { client } = useStore();
    const { is_authorize } = client;

    const { data, isLoading, isSuccess } = useFetch('get_settings', { options: { enabled: is_authorize } });

    return {
        is_payment_agent_transfer_visible: Boolean(data?.is_authenticated_payment_agent),
        is_loading: isLoading,
        is_success: isSuccess,
    };
};

export default usePaymentAgentTransferVisible;
