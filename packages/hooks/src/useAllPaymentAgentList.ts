import { useEffect } from 'react';
import { useWS } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useAllPaymentAgentList = () => {
    const { client } = useStore();
    const { residence } = client;
    const { send, ...rest } = useWS('paymentagent_list');

    useEffect(() => {
        send({ paymentagent_list: residence });
    }, [residence, send]);

    return rest;
};

export default useAllPaymentAgentList;
