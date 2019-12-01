import classNames             from 'classnames';
import PropTypes              from 'prop-types';
import React                  from 'react';
import { withRouter }         from 'react-router';
import {
    Button,
    ThemedScrollbars }        from 'deriv-components';
import { localize, Localize } from 'deriv-translations';
import Icon                   from 'Assets/icon.jsx';
import routes                 from 'Constants/routes';
import { connect }            from 'Stores/connect';
import PaymentAgentDetails    from './payment-agent-details.jsx';

class PaymentAgentReceipt extends React.Component {
    openStatement = () => {
        this.props.history.push(routes.statement);
        this.props.resetPaymentAgent();
        this.props.toggleCashierModal();
    };

    componentWillUnmount() {
        this.props.resetPaymentAgent();
    }

    render() {
        const payment_agent = this.props.receipt.payment_agent_name || this.props.receipt.payment_agent_id;
        return (
            <div className='cashier__wrapper--align-left'>
                <ThemedScrollbars
                    autoHide
                    autoHeightMax={550}
                >
                    <div className='cashier__success'>
                        <h2 className='cashier__header'>
                            <Localize
                                i18n_default_text='Your funds have been transferred to {{payment_agent}}.'
                                values={{ payment_agent }}
                                options={{ interpolation: { escapeValue: false } }}
                            />
                        </h2>
                        <div className='cashier__transferred-amount cashier__text--bold'>
                            <span
                                className={classNames('symbols', `symbols--${this.props.currency.toLowerCase()}`)}
                            />
                            {this.props.receipt.amount_transferred}
                        </div>
                        <div className='cashier__transferred-details-wrapper'>
                            <Icon icon='IconAccountsCurrency' type={this.props.currency.toLowerCase()} />
                            <span className='cashier__transferred-details'>
                                <span className='cashier__text--bold'>{this.props.currency}</span>&nbsp;({this.props.loginid})
                            </span>
                            <Icon className='cashier__transferred-icon' icon='IconBack' />
                            <Icon icon='IconPaymentAgent' />
                            <span className='cashier__transferred-details'>
                                {this.props.receipt.payment_agent_name && <span className='cashier__text--bold'>{this.props.receipt.payment_agent_name}&nbsp;</span>}({this.props.receipt.payment_agent_id})
                            </span>
                        </div>
                    </div>
                    <h2 className='cashier__header'><Localize i18n_default_text='IMPORTANT NOTICE TO RECEIVE YOUR FUNDS' /></h2>
                    <p className='payment-agent__explanation cashier__paragraph'><Localize i18n_default_text={'You\'re not done yet. To receive the transferred funds, you must contact the payment agent for further instruction. A summary of this transaction has been emailed to you for your records.'} /></p>
                    {this.props.receipt.payment_agent_name &&
                    <div className='payment-agent__transferred-contact-wrapper'>
                        <p className='cashier__paragraph payment-agent__paragraph'><Localize i18n_default_text='{{payment_agent}} agent contact details:' values={{ payment_agent: this.props.receipt.payment_agent_name }} options={{ interpolation: { escapeValue: false } }} /></p>
                        <PaymentAgentDetails
                            className='payment-agent__transferred-contact'
                            payment_agent_email={this.props.receipt.payment_agent_email}
                            payment_agent_phone={this.props.receipt.payment_agent_phone}
                            payment_agent_url={this.props.receipt.payment_agent_url}
                        />
                    </div>
                    }
                </ThemedScrollbars>
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
                        onClick={this.props.resetPaymentAgent}
                        primary
                        large
                    />
                </div>
            </div>
        );
    }
}

PaymentAgentReceipt.propTypes = {
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
)(PaymentAgentReceipt));
