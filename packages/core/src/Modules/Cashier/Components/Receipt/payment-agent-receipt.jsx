import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Button, Icon } from '@deriv/components';
import { routes, getCurrencyDisplayCode, formatMoney } from '@deriv/shared';

import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import PaymentAgentDetails from '../payment-agent-details.jsx';

class PaymentAgentReceipt extends React.Component {
    openStatement = () => {
        this.props.history.push(routes.statement);
        this.props.resetPaymentAgent();
    };

    componentWillUnmount() {
        this.props.resetPaymentAgent();
    }

    render() {
        const { currency, loginid, receipt, resetPaymentAgent } = this.props;

        const currency_lowercase = currency.toLowerCase();

        return (
            <div className='cashier__wrapper--align-left payment-agent__receipt '>
                <div className='cashier__success'>
                    <h2 className='cashier__header'>
                        <Localize i18n_default_text='Your funds have been transferred' />
                    </h2>
                    <div className='cashier__transferred-amount cashier__text--bold'>
                        {formatMoney(currency, receipt.amount_transferred, true)}
                        <span className={classNames('symbols', `symbols--${currency_lowercase}`)}>
                            {getCurrencyDisplayCode(currency)}
                        </span>
                    </div>
                    <div className='cashier__transferred-details-wrapper'>
                        <Icon icon={`IcCurrency-${currency_lowercase}`} />
                        <span className='cashier__transferred-details'>
                            <span className='cashier__text--bold'>{getCurrencyDisplayCode(currency)}</span>
                            &nbsp;(
                            {loginid})
                        </span>
                        <Icon className='cashier__transferred-icon' icon='IcArrowLeftBold' />
                        <Icon icon='IcPA' />
                        <span className='cashier__transferred-details'>
                            {receipt.payment_agent_name && (
                                <span className='cashier__text--bold'>{receipt.payment_agent_name}&nbsp;</span>
                            )}
                            ({receipt.payment_agent_id})
                        </span>
                    </div>
                </div>
                <h2 className='cashier__header'>
                    <Localize i18n_default_text='IMPORTANT NOTICE TO RECEIVE YOUR FUNDS' />
                </h2>
                <p className='payment-agent__explanation cashier__paragraph'>
                    <Localize
                        i18n_default_text={
                            "You're not done yet. To receive the transferred funds, you must contact the payment agent for further instruction. A summary of this transaction has been emailed to you for your records."
                        }
                    />
                </p>
                {receipt.payment_agent_name && (
                    <div className='payment-agent__transferred-contact-wrapper'>
                        <p className='cashier__paragraph payment-agent__paragraph'>
                            <Localize
                                i18n_default_text='{{payment_agent}} agent contact details:'
                                values={{ payment_agent: receipt.payment_agent_name }}
                                options={{ interpolation: { escapeValue: false } }}
                            />
                        </p>
                        <PaymentAgentDetails
                            className='payment-agent__transferred-contact'
                            payment_agent_email={receipt.payment_agent_email}
                            payment_agent_phone={receipt.payment_agent_phone}
                            payment_agent_url={receipt.payment_agent_url}
                        />
                    </div>
                )}
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
                        text={localize('Make a new transfer')}
                        onClick={resetPaymentAgent}
                        primary
                        large
                    />
                </div>
            </div>
        );
    }
}

PaymentAgentReceipt.propTypes = {
    clearVerification: PropTypes.func,
    currency: PropTypes.string,
    loginid: PropTypes.string,
    receipt: PropTypes.object,
};

export default withRouter(
    connect(({ client, modules }) => ({
        currency: client.currency,
        loginid: client.loginid,
        receipt: modules.cashier.config.payment_agent.receipt,
        resetPaymentAgent: modules.cashier.resetPaymentAgent,
    }))(PaymentAgentReceipt)
);
