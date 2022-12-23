import React from 'react';
import { Loading } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import PaymentAgentContainer from '../payment-agent-container';

const DepositTab = observer(() => {
    const { modules } = useStore();
    const { payment_agent, general_store } = modules.cashier;

    React.useEffect(() => {
        payment_agent.onMountPaymentAgentList();
    }, [payment_agent]);

    return (
        <div>{general_store.is_loading ? <Loading is_fullscreen={false} /> : <PaymentAgentContainer is_deposit />}</div>
    );
});

export default DepositTab;
