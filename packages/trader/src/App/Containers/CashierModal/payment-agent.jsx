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
                        onChangePaymentMethod={this.props.onChangePaymentMethod}
                        onMount={this.props.onMount}
                        selected_bank={this.props.selected_bank}
                        supported_banks={this.props.supported_banks}
                    />
                    :
                    <PaymentAgentList
                        onChangePaymentMethod={this.props.onChangePaymentMethod}
                        onMount={this.props.onMount}
                        selected_bank={this.props.selected_bank}
                        supported_banks={this.props.supported_banks}
                    />
                }
            </React.Fragment>
        );
    }
}

PaymentAgent.propTypes = {
    container            : PropTypes.string,
    onChangePaymentMethod: PropTypes.func,
    onMount              : PropTypes.func,
    selected_bank        : PropTypes.string,
    setActiveTab         : PropTypes.func,
    supported_banks      : MobxPropTypes.arrayOrObservableArray,
    verification_code    : PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        verification_code    : client.verification_code,
        container            : modules.cashier.config.payment_agent.container,
        onChangePaymentMethod: modules.cashier.onChangePaymentMethod,
        onMount              : modules.cashier.onMountPaymentAgent,
        setActiveTab         : modules.cashier.setActiveTab,
        selected_bank        : modules.cashier.config.payment_agent.selected_bank,
        supported_banks      : modules.cashier.config.payment_agent.supported_banks,
    })
)(PaymentAgent);
