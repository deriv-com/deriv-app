import PropTypes        from 'prop-types';
import React            from 'react';
import { connect }      from 'Stores/connect';
import Error            from './error.jsx';
import SendEmail        from './send-email.jsx';
import PaymentAgentList from './PaymentAgent/payment-agent-list.jsx';

class PaymentAgent extends React.Component {
    componentDidMount() {
        this.props.setActiveTab('payment_agent');
    }

    render() {
        return (
            <React.Fragment>
                {this.props.error.message ?
                    <Error
                        error={this.props.error}
                        container='withdraw'
                    />
                    :
                    (this.props.verification_code ?
                        <SendEmail />
                        :
                        <PaymentAgentList />
                    )
                }
            </React.Fragment>
        );
    }
}

PaymentAgent.propTypes = {
    error            : PropTypes.object,
    setActiveTab     : PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        verification_code: client.verification_code,
        error            : modules.cashier.config.withdraw.error,
        setActiveTab     : modules.cashier.setActiveTab,
    })
)(PaymentAgent);
