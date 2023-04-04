import React from 'react';
import { Loading } from '@deriv/components';
import { observer } from '@deriv/stores';
import PaymentAgentContainer from '../payment-agent-container';
import { useCashierStore } from '../../../stores/useCashierStores';

const DepositTab = observer(() => {
    const { payment_agent, general_store } = useCashierStore();

    React.useEffect(() => {
        payment_agent.onMountPaymentAgentList();
    }, [payment_agent]);

    return (
        <div>{general_store.is_loading ? <Loading is_fullscreen={false} /> : <PaymentAgentContainer is_deposit />}</div>
    );
});

export default DepositTab;
