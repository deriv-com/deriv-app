import { useFetch } from '@deriv-app/api';
import { useStore } from '@deriv-app/stores';

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
