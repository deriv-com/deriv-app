import PropTypes                   from 'prop-types';
import React                       from 'react';
import { connect }                 from 'Stores/connect';
import PaymentAgentTransferForm    from './PaymentAgentTransfer/payment-agent-transfer-form.jsx';
import PaymentAgentTransferReceipt from './PaymentAgentTransfer/payment-agent-transfer-receipt.jsx';
import NoBalance                   from './no-balance.jsx';
import Error                       from './error.jsx';
import Virtual                     from './virtual.jsx';
import Loading                     from '../../../templates/_common/components/loading.jsx';

class PaymentAgentTransfer extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnMount();
    }

    render() {
        if (this.props.is_virtual) {
            return <Virtual />;
        }
        if (this.props.is_loading) {
            return <Loading className='cashier__loader' />;
        }
        if (this.props.error.is_show_full_page) {
            // for errors with CTA hide the form and show the error,
            // for others show them at the bottom of the form next to submit button
            return <Error error={this.props.error} />;
        }
        if (!+this.props.balance) {
            return <NoBalance />;
        }
        return (
            <React.Fragment>
                {this.props.is_transfer_successful ?
                    <PaymentAgentTransferReceipt />
                    :
                    <PaymentAgentTransferForm error={this.props.error} />
                }
            </React.Fragment>
        );
    }
}

PaymentAgentTransfer.propTypes = {
    balance               : PropTypes.string,
    container             : PropTypes.string,
    error                 : PropTypes.object,
    is_loading            : PropTypes.bool,
    is_transfer_successful: PropTypes.bool,
    is_virtual            : PropTypes.bool,
    onMount               : PropTypes.func,
    onUnMount             : PropTypes.func,
    setActiveTab          : PropTypes.func,
};

export default connect(
    ({ client, modules }) => ({
        balance               : client.balance,
        is_virtual            : client.is_virtual,
        container             : modules.cashier.config.payment_agent_transfer.container,
        error                 : modules.cashier.config.payment_agent_transfer.error,
        is_loading            : modules.cashier.is_loading,
        is_transfer_successful: modules.cashier.config.payment_agent_transfer.is_transfer_successful,
        onMount               : modules.cashier.onMountPaymentAgentTransfer,
        onUnMount             : modules.cashier.resetPaymentAgentTransfer,
        setActiveTab          : modules.cashier.setActiveTab,
    })
)(PaymentAgentTransfer);
