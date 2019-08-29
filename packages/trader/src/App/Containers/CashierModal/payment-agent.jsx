import PropTypes            from 'prop-types';
import React                from 'react';
import { connect }          from 'Stores/connect';
import PaymentAgentList     from './PaymentAgent/payment-agent-list.jsx';
import PaymentAgentWithdraw from './PaymentAgent/payment-agent-withdraw.jsx';

class PaymentAgent extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
    }

    render() {
        return (
            <React.Fragment>
                {this.props.verification_code ?
                    <PaymentAgentWithdraw />
                    :
                    <PaymentAgentList />
                }
            </React.Fragment>
        );
    }
}

PaymentAgent.propTypes = {
    container        : PropTypes.string,
    setActiveTab     : PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        verification_code: client.verification_code,
        container        : modules.cashier.config.payment_agent.container,
        setActiveTab     : modules.cashier.setActiveTab,
    })
)(PaymentAgent);
