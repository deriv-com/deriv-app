import PropTypes                   from 'prop-types';
import React                       from 'react';
import { connect }                 from 'Stores/connect';
import PaymentAgentTransferForm    from './PaymentAgentTransfer/payment-agent-transfer-form.jsx';
import PaymentAgentTransferReceipt from './PaymentAgentTransfer/payment-agent-transfer-receipt.jsx';
import NoBalance                   from './no-balance.jsx';
import Error                       from './error.jsx';
import Loading                     from '../../../templates/_common/components/loading.jsx';

class PaymentAgentTransfer extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
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
                        {this.props.error.is_show_full_page ?
                            <Error error={this.props.error} />
                            :
                            (this.props.has_no_balance ?
                                <NoBalance />
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
    onUnMount             : PropTypes.func,
    setActiveTab          : PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        container             : modules.cashier.config.payment_agent_transfer.container,
        error                 : modules.cashier.config.payment_agent_transfer.error,
        has_no_balance        : modules.cashier.has_no_balance,
        is_loading            : modules.cashier.is_loading,
        is_transfer_successful: modules.cashier.config.payment_agent_transfer.is_transfer_successful,
        onUnMount             : modules.cashier.resetPaymentAgentTransfer,
        setActiveTab          : modules.cashier.setActiveTab,
    })
)(PaymentAgentTransfer);
