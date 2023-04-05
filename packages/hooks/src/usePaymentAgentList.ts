import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

const usePaymentAgentList = (currency?: string) => {
    const { client } = useStore();
    const { residence } = client;

    const { data, isLoading } = useFetch('paymentagent_list', {
        payload: { paymentagent_list: residence, currency },
        options: { enabled: Boolean(residence) },
    });

    return {
        all_payment_agent_list: data?.list,
        is_loading: isLoading,
    };
};

export default usePaymentAgentList;
