import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router';
import Localize       from 'App/Components/Elements/localize.jsx';
import Icon           from 'Assets/icon.jsx';
import routes         from 'Constants/routes';
import { connect }    from 'Stores/connect';

class AccountTransferReceipt extends React.Component {
    openStatement = () => {
        this.props.history.push(routes.statement);
        // this.props.resetPaymentAgent();
        this.props.toggleCashierModal();
    };

    // componentWillUnmount() {
    //     this.props.resetPaymentAgent();
    // }

    render() {
        return (
            <div className='cashier__wrapper account-transfer__receipt'>
                <Icon icon='IconTransferDone' className='account-transfer__receipt-icon' />
                <h2 className='cashier__header'>
                    <Localize i18n_default_text='Your funds have been transferred.' />
                </h2>
                <div className='cashier__transferred-amount cashier__text--bold'>
                    <span
                        className={classNames('symbols', `symbols--${this.props.currency.toLowerCase()}`)}
                    />
                    {this.props.receipt.amount_transferred}
                </div>
            </div>
        );
    }
}

AccountTransferReceipt.propTypes = {
    currency          : PropTypes.string,
    receipt           : PropTypes.object,
    toggleCashierModal: PropTypes.func,
};

export default withRouter(connect(
    ({ client, modules, ui }) => ({
        currency          : client.currency,
        loginid           : client.loginid,
        receipt           : modules.cashier.config.account_transfer.receipt,
        toggleCashierModal: ui.toggleCashierModal,
    })
)(AccountTransferReceipt));
