import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router';
import { Button }     from 'deriv-components';
import Localize       from 'App/Components/Elements/localize.jsx';
import { localize }   from 'App/i18n';
import Icon           from 'Assets/icon.jsx';
import routes         from 'Constants/routes';
import { connect }    from 'Stores/connect';

class PaymentAgentReceipt extends React.Component {
    openStatement = () => {
        this.props.history.push(routes.statement);
        this.props.toggleCashierModal();
    };

    resetPaymentAgent = () => {
        this.props.setIsWithdraw(false);
    };

    render() {
        return (
            <React.Fragment>
                <div className='payment-agent__receipt'>
                    <h2 className='payment-agent__header'>
                        <Localize
                            i18n_default_text='Your funds have been transferred to {{payment_agent}}.'
                            values={{ payment_agent: this.props.payment_agent_name || this.props.payment_agent_id }}
                        />
                    </h2>
                    <div className='payment-agent__transferred-amount payment-agent__text--bold'>
                        <span
                            className={classNames('symbols', `symbols--${this.props.currency.toLowerCase()}`)}
                        />
                        {this.props.amount_transferred}
                    </div>
                    <div className='payment-agent__transferred-details-wrapper'>
                        <Icon icon='IconAccountsCurrency' type={this.props.currency.toLowerCase()} />
                        <span className='payment-agent__transferred-details'>
                            <span className='payment-agent__text--bold'>{this.props.currency}</span>&nbsp;({this.props.loginid})
                        </span>
                        <Icon className='payment-agent__transferred-icon' icon='IconBack' />
                        <Icon icon='IconPaymentAgent' />
                        <span className='payment-agent__transferred-details'>
                            {this.props.payment_agent_name && <span className='payment-agent__text--bold'>{this.props.payment_agent_name}&nbsp;</span>}({this.props.loginid})
                        </span>
                    </div>
                </div>
                <div className='payment-agent__separator' />
                {this.props.payment_agent_name ?
                    <React.Fragment>
                        <h2 className='payment-agent__header'><Localize i18n_default_text='IMPORTANT NOTICE TO RECEIVE YOUR FUNDS' /></h2>
                        <p className='payment-agent__explanation'><Localize i18n_default_text={'You\'re not done yet. To receive the transferred funds, you must contact the payment agent for further instruction. A summary of this transaction has been emailed to you for your records.'} /></p>
                        <p><Localize i18n_default_text='{{payment_agent}} agent contact details:' values={{ payment_agent: this.props.payment_agent_name }} /></p>
                        <div className='payment-agent__accordion-content payment-agent__transferred-contact'>
                            <div className='payment-agent__accordion-content-line'><Icon icon='IconPhone' className='payment-agent__accordion-content-icon' />{this.props.payment_agent_phone}</div>
                            <div className='payment-agent__accordion-content-line'><Icon icon='IconWebsite' className='payment-agent__accordion-content-icon' />{this.props.payment_agent_url}</div>
                            <div><Icon icon='IconEmail' className='payment-agent__accordion-content-icon' />{this.props.payment_agent_email}</div>
                        </div>
                    </React.Fragment>
                    :
                    <p className='payment-agent__text'><Localize i18n_default_text='Please contact your payment agent to validate your withdrawal request.' /></p>
                }
                <div className='payment-agent__buttons'>
                    <Button
                        className='btn--secondary btn--secondary--orange payment-agent__statement-button'
                        has_effect
                        text={localize('View in statement')}
                        onClick={this.openStatement}
                    />
                    <Button
                        className='btn--primary btn--primary--orange payment-agent__done-button'
                        has_effect
                        text={localize('Done')}
                        onClick={this.resetPaymentAgent}
                    />
                </div>
            </React.Fragment>
        );
    }
}

PaymentAgentReceipt.propTypes = {
    amount_transferred : PropTypes.string,
    currency           : PropTypes.string,
    loginid            : PropTypes.string,
    payment_agent_email: PropTypes.string,
    payment_agent_id   : PropTypes.string,
    payment_agent_name : PropTypes.string,
    payment_agent_phone: PropTypes.string,
    payment_agent_url  : PropTypes.string,
    setIsWithdraw      : PropTypes.func,
    toggleCashierModal : PropTypes.func,
};

export default withRouter(connect(
    ({ client, modules, ui }) => ({
        currency           : client.currency,
        loginid            : client.loginid,
        amount_transferred : '500.00', // TODO: get this from store
        payment_agent_email: 'toppayment1@gmail.com', // TODO: get this from store
        payment_agent_id   : 'CR818510', // TODO: get this from store
        // payment_agent_name : '1toppayment', // TODO: get this from store
        payment_agent_name : '', // TODO: get this from store
        payment_agent_phone: '+6287734117431', // TODO: get this from store
        payment_agent_url  : 'www.1toppayment.net', // TODO: get this from store
        setIsWithdraw      : modules.cashier.setIsWithdraw,
        toggleCashierModal : ui.toggleCashierModal,
    })
)(PaymentAgentReceipt));
