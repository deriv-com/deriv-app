import React from 'react';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/types';
import CashierLocked from 'Components/cashier-locked';
import PaymentAgentList from './payment-agent-list';
import { Virtual } from 'Components/cashier-container';

type TPaymentAgentProps = {
    container?: string;
    is_cashier_locked?: boolean;
    is_payment_agent_withdraw?: boolean;
    is_switching?: boolean;
    is_virtual?: boolean;
    payment_agent_active_tab_index?: number;
    setActiveTab?: (container?: string) => void;
    setPaymentAgentActiveTabIndex?: (index: number) => void;
    verification_code?: string;
};

const PaymentAgent = ({
    container,
    is_cashier_locked,
    is_payment_agent_withdraw,
    is_switching,
    is_virtual,
    payment_agent_active_tab_index,
    setActiveTab,
    setPaymentAgentActiveTabIndex,
    verification_code,
}: TPaymentAgentProps) => {
    const initial_active_index =
        verification_code || is_payment_agent_withdraw || payment_agent_active_tab_index ? 1 : 0;
    if (setPaymentAgentActiveTabIndex) setPaymentAgentActiveTabIndex(initial_active_index);

    React.useEffect(() => {
        if (setActiveTab) setActiveTab(container);
        return () => {
            if (setPaymentAgentActiveTabIndex) setPaymentAgentActiveTabIndex(0);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (is_switching) {
        return <Loading />;
    }

    if (is_virtual) {
        return <Virtual />;
    }
    if (is_cashier_locked) {
        return <CashierLocked />;
    }
    return (
        <PaymentAgentList verification_code={verification_code} is_payment_agent_withdraw={is_payment_agent_withdraw} />
    );
};

export default connect(({ client, modules }: RootStore) => ({
    container: modules.cashier.payment_agent?.container,
    is_cashier_locked: modules.cashier.general_store.is_cashier_locked,
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    is_payment_agent_withdraw: modules.cashier.payment_agent.is_withdraw,
    payment_agent_active_tab_index: modules.cashier.payment_agent.active_tab_index,
    setActiveTab: modules.cashier.general_store.setActiveTab,
    setPaymentAgentActiveTabIndex: modules.cashier.payment_agent.setActiveTabIndex,
    verification_code: client.verification_code.payment_agent_withdraw,
}))(PaymentAgent);
