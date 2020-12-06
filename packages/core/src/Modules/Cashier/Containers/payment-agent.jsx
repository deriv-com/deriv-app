import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'Stores/connect';
import PaymentAgentList from '../Components/payment-agent-list.jsx';
import Virtual from '../Components/Error/virtual.jsx';
import PaymentAgentWithdrawForm from '../Components/Form/payment-agent-withdraw-form.jsx';

const PaymentAgent = ({ setActiveTab, container, is_virtual, verification_code, is_payment_agent_withdraw }) => {
    React.useEffect(() => {
        setActiveTab(container);
    }, []);

    if (is_virtual) {
        return <Virtual />;
    }
    if (verification_code || is_payment_agent_withdraw) {
        return <PaymentAgentWithdrawForm verification_code={verification_code} />;
    }
    return <PaymentAgentList />;
};

PaymentAgent.propTypes = {
    container: PropTypes.string,
    is_payment_agent_withdraw: PropTypes.bool,
    is_virtual: PropTypes.bool,
    setActiveTab: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    is_virtual: client.is_virtual,
    verification_code: client.verification_code.payment_agent_withdraw,
    container: modules.cashier.config.payment_agent.container,
    is_payment_agent_withdraw: modules.cashier.config.payment_agent.is_withdraw,
    setActiveTab: modules.cashier.setActiveTab,
}))(PaymentAgent);
