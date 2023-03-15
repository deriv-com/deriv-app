import React from 'react';
import { useWS } from '@deriv/api';
import { useStore } from '@deriv/stores';

const usePaymentAgentList = (currency?: string) => {
    const { client } = useStore();
    const { residence } = client;

    const { send: _send, ...rest } = useWS('paymentagent_list');

    const send = React.useCallback(() => {
        _send({ paymentagent_list: residence, currency });
    }, [_send, currency, residence]);

    return {
        ...rest,
        send,
    };
};

export default usePaymentAgentList;
