import React from 'react';
import { observer } from 'mobx-react-lite';
import { Loading } from '@deriv/components';
import { useStore } from '@deriv/stores';
import PaymentAgentContainer from '../payment-agent-container';

const DepositTab = () => {
    const { modules } = useStore();
    const { payment_agent, general_store } = modules.cashier;

    React.useEffect(() => {
        payment_agent.onMountPaymentAgentList();
    }, [payment_agent]);

    return (
        <div>{general_store.is_loading ? <Loading is_fullscreen={false} /> : <PaymentAgentContainer is_deposit />}</div>
    );
};

export default observer(DepositTab);
