import PropTypes      from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router';
import Localize       from 'App/Components/Elements/localize.jsx';
import routes         from 'Constants/routes';
import { connect }    from 'Stores/connect';

class AccountTransferReceipt extends React.Component {
    openStatement = () => {
        this.props.history.push(routes.statement);
        this.props.resetPaymentAgent();
        this.props.toggleCashierModal();
    };

    componentWillUnmount() {
        this.props.resetPaymentAgent();
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        return (
            <div className='account-transfer__receipt'>
                <h2 className='cashier__header'>
                    <Localize i18n_default_text='Your funds have been transferred.' />
                </h2>
            </div>
        );
    }
}

AccountTransferReceipt.propTypes = {
    clearVerification : PropTypes.func,
    currency          : PropTypes.string,
    loginid           : PropTypes.string,
    receipt           : PropTypes.object,
    toggleCashierModal: PropTypes.func,
};

export default withRouter(connect(
    ({ client, modules, ui }) => ({
        currency          : client.currency,
        loginid           : client.loginid,
        receipt           : modules.cashier.config.payment_agent.receipt,
        resetPaymentAgent : modules.cashier.resetPaymentAgent,
        toggleCashierModal: ui.toggleCashierModal,
    })
)(AccountTransferReceipt));
