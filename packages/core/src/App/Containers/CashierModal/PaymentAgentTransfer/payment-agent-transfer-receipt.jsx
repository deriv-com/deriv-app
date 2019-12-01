import classNames             from 'classnames';
import PropTypes              from 'prop-types';
import React                  from 'react';
import { withRouter }         from 'react-router';
import { Button }             from 'deriv-components';
import CurrencyUtils          from 'deriv-shared/utils/currency';
import { localize, Localize } from 'deriv-translations';
import Icon                   from 'Assets/icon.jsx';
import routes                 from 'Constants/routes';
import { connect }            from 'Stores/connect';

class PaymentAgentTransferReceipt extends React.Component {
    openStatement = () => {
        this.props.history.push(routes.statement);
        this.props.resetPaymentAgentTransfer();
        this.props.toggleCashierModal();
    };

    render() {
        return (
            <div className='cashier__wrapper'>
                <div className='cashier__success'>
                    <h2 className='cashier__header'>
                        <Localize i18n_default_text='Your funds have been transferred to {{name}}.' values={{ name: this.props.receipt.client_name }} />
                    </h2>
                    <div className='cashier__transferred-amount cashier__text--bold'>
                        <span
                            className={classNames('symbols', `symbols--${this.props.currency.toLowerCase()}`)}
                        />
                        {CurrencyUtils.formatMoney(this.props.currency, this.props.receipt.amount_transferred, true)}
                    </div>
                    <div className='cashier__transferred-details-wrapper'>
                        <span className='account-transfer__transfer-details-from'>
                            <Icon
                                icon='IconAccountsCurrency'
                                type={this.props.currency.toLowerCase()}
                                height={16}
                                width={16}
                            />
                            <span className='cashier__transferred-details'>
                                <span className='cashier__text--bold'>{this.props.currency.toUpperCase()}</span>&nbsp;({this.props.loginid})
                            </span>
                        </span>
                        <Icon className='cashier__transferred-icon' icon='IconBack' />
                        <span className='account-transfer__transfer-details-to'>
                            <Icon icon='IconUser' />
                            <span className='cashier__transferred-details'>
                                <span className='cashier__text--bold'>{this.props.receipt.client_name}</span>&nbsp;({this.props.receipt.client_id})
                            </span>
                        </span>
                    </div>
                </div>
                <div className='cashier__form-submit'>
                    <Button
                        className='cashier__form-submit-button'
                        has_effect
                        text={localize('View in statement')}
                        onClick={this.openStatement}
                        secondary
                        large
                    />
                    <Button
                        className='cashier__form-submit-button cashier__done-button'
                        has_effect
                        text={localize('Done')}
                        onClick={this.props.resetPaymentAgentTransfer}
                        primary
                        large
                    />
                </div>
            </div>
        );
    }
}

PaymentAgentTransferReceipt.propTypes = {
    currency                 : PropTypes.string,
    loginid                  : PropTypes.string,
    receipt                  : PropTypes.object,
    resetPaymentAgentTransfer: PropTypes.func,
    toggleCashierModal       : PropTypes.func,
};

export default withRouter(connect(
    ({ client, modules, ui }) => ({
        currency                 : client.currency,
        loginid                  : client.loginid,
        receipt                  : modules.cashier.config.payment_agent_transfer.receipt,
        resetPaymentAgentTransfer: modules.cashier.resetPaymentAgentTransfer,
        toggleCashierModal       : ui.toggleCashierModal,
    })
)(PaymentAgentTransferReceipt));
