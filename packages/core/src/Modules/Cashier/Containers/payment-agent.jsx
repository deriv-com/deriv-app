import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'Stores/connect';
import PaymentAgentList from '../Components/payment-agent-list.jsx';
import Virtual from '../Components/Error/virtual.jsx';
import PaymentAgentWithdrawForm from '../Components/Form/payment-agent-withdraw-form.jsx';

class PaymentAgent extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
    }

    render() {
        if (this.props.is_virtual) {
            return <Virtual />;
        }
        if (this.props.verification_code || this.props.is_payment_agent_withdraw) {
            return <PaymentAgentWithdrawForm verification_code={this.props.verification_code} />;
        }
        return <PaymentAgentList />;
    }
}

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
