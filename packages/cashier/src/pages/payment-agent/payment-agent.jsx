import PropTypes from 'prop-types';
import React from 'react';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import CashierLocked from 'Components/cashier-locked';
import { Virtual } from 'Components/cashier-container';
import PaymentAgentList from './payment-agent-list';

const PaymentAgent = observer(({ setSideNotes }) => {
    const {
        client,
        modules: {
            cashier: { general_store, payment_agent },
        },
    } = useStore();

    const {
        is_switching,
        is_virtual,
        verification_code: { payment_agent_withdraw: verification_code },
    } = client;

    const { is_cashier_locked, setActiveTab } = general_store;

    const {
        container,
        is_withdraw: is_payment_agent_withdraw,
        active_tab_index: payment_agent_active_tab_index,
        setActiveTabIndex: setPaymentAgentActiveTabIndex,
    } = payment_agent;

    const initial_active_index =
        verification_code || is_payment_agent_withdraw || payment_agent_active_tab_index ? 1 : 0;
    setPaymentAgentActiveTabIndex(initial_active_index);

    React.useEffect(() => {
        setActiveTab(container);
        return () => {
            setPaymentAgentActiveTabIndex(0);
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

    return <PaymentAgentList setSideNotes={setSideNotes} />;
});

PaymentAgent.propTypes = {
    setSideNotes: PropTypes.func,
};

export default PaymentAgent;
