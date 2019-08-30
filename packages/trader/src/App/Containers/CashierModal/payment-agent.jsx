import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { connect }                    from 'Stores/connect';
import PaymentAgentList               from './PaymentAgent/payment-agent-list.jsx';
import PaymentAgentWithdraw           from './PaymentAgent/payment-agent-withdraw.jsx';

class PaymentAgent extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
    }

    render() {
        return (
            <React.Fragment>
                {this.props.verification_code ?
                    <PaymentAgentWithdraw
                        supported_banks={this.props.supported_banks}
                        onChangePaymentMethod={this.props.onChangePaymentMethod}
                    />
                    :
                    <PaymentAgentList
                        supported_banks={this.props.supported_banks}
                        onChangePaymentMethod={this.props.onChangePaymentMethod}
                    />
                }
            </React.Fragment>
        );
    }
}

PaymentAgent.propTypes = {
    container            : PropTypes.string,
    onChangePaymentMethod: PropTypes.func,
    setActiveTab         : PropTypes.func,
    supported_banks      : MobxPropTypes.arrayOrObservableArray,
    verification_code    : PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        verification_code    : client.verification_code,
        container            : modules.cashier.config.payment_agent.container,
        onChangePaymentMethod: modules.cashier.onChangePaymentMethod,
        setActiveTab         : modules.cashier.setActiveTab,
        supported_banks      : modules.cashier.config.payment_agent.supported_banks,
    })
)(PaymentAgent);
