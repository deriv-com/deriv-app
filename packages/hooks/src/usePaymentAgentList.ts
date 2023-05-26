import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

const usePaymentAgentList = (currency?: string) => {
    const { client } = useStore();
    const { residence } = client;

    const { data, ...rest } = useFetch('paymentagent_list', {
        payload: { paymentagent_list: residence, currency },
        options: { enabled: Boolean(residence) },
    });

    return {
        data: data?.paymentagent_list?.list,
        ...rest,
    };
};

export default usePaymentAgentList;
