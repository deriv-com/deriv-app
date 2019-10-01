import PropTypes                   from 'prop-types';
import React                       from 'react';
import { connect }                 from 'Stores/connect';
import PaymentAgentTransferForm    from './PaymentAgentTransfer/payment-agent-transfer-form.jsx';
import PaymentAgentTransferReceipt from './PaymentAgentTransfer/payment-agent-transfer-receipt.jsx';
import TransferNoBalance           from './transfer-no-balance.jsx';
import Error                       from './error.jsx';
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
        return (
            <React.Fragment>
                {this.props.is_loading ?
                    <Loading className='cashier__loader' />
                    :
                    <React.Fragment>
                        {/* for errors with CTA hide the form and show the error,
                         for others show them at the bottom of the form next to submit button */}
                        {this.props.error.button_text ?
                            <Error error={this.props.error} />
                            :
                            (this.props.has_no_balance ?
                                <TransferNoBalance setModalIndex={this.props.setModalIndex} />
                                :
                                (this.props.is_transfer_successful ?
                                    <PaymentAgentTransferReceipt />
                                    :
                                    <PaymentAgentTransferForm error={this.props.error} />
                                )
                            )
                        }
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

PaymentAgentTransfer.propTypes = {
    container             : PropTypes.string,
    error                 : PropTypes.object,
    has_no_balance        : PropTypes.bool,
    is_loading            : PropTypes.bool,
    is_transfer_successful: PropTypes.bool,
    onMount               : PropTypes.func,
    setActiveTab          : PropTypes.func,
    setModalIndex         : PropTypes.func,
};

export default connect(
    ({ modules, ui }) => ({
        container             : modules.cashier.config.payment_agent_transfer.container,
        error                 : modules.cashier.config.payment_agent_transfer.error,
        has_no_balance        : modules.cashier.config.payment_agent_transfer.has_no_balance,
        is_loading            : modules.cashier.is_loading,
        is_transfer_successful: modules.cashier.config.payment_agent_transfer.is_transfer_successful,
        onMount               : modules.cashier.onMountPaymentAgentTransfer,
        onUnMount             : modules.cashier.resetPaymentAgentTransfer,
        setActiveTab          : modules.cashier.setActiveTab,
        setModalIndex         : ui.setModalIndex,
    })
)(PaymentAgentTransfer);
