import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Button, Text } from '@deriv/components';
import { isMobile, routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import PaymentAgentDetails from '../payment-agent-details';
import './payment-agent-receipt.scss';

const openStatement = (history, resetPaymentAgent) => {
    history.push(routes.statement);
    resetPaymentAgent();
};

const PaymentAgentReceipt = ({ currency, history, is_from_derivgo, receipt, resetPaymentAgent }) => {
    React.useEffect(() => {
        return () => resetPaymentAgent();
    }, [resetPaymentAgent]);

    return (
        <div className='cashier__wrapper--align-center payment-agent-receipt'>
            <Text
                as='h1'
                align='center'
                className='payment-agent-receipt__header'
                color='prominent'
                line_height='m'
                size={isMobile() ? 'xsm' : 'sm'}
                weight='bold'
            >
                <Localize
                    i18n_default_text='You’ve transferred {{amount}} {{currency}}'
                    values={{ amount: receipt.amount_transferred, currency }}
                />
            </Text>
            <Text as='p' align='center' color='prominent' line_height='m' size='xs' weight='bold'>
                <Localize i18n_default_text='Important notice to receive your funds' />
            </Text>
            <Text
                as='p'
                align='center'
                color='prominent'
                size='xxs'
                line_height='m'
                className='payment-agent-receipt__explanation'
            >
                <Localize
                    i18n_default_text={
                        'To receive your funds, contact the payment agent with the details below. <0></0>We’ve sent you a summary of this transaction via email.'
                    }
                    components={!isMobile() ? [<br key={0} />] : []}
                    key={0}
                />
            </Text>
            {receipt.payment_agent_name && (
                <div className='payment-agent-receipt__transferred-contact-wrapper'>
                    <Text align='center' as='p' size='xxs' line_height='m' weight='bold'>
                        <Localize
                            i18n_default_text="{{payment_agent}}'s contact details"
                            values={{ payment_agent: receipt.payment_agent_name }}
                            options={{ interpolation: { escapeValue: false } }}
                        />
                    </Text>
                    <PaymentAgentDetails
                        className='payment-agent-receipt__transferred-contact'
                        payment_agent_email={receipt.payment_agent_email}
                        payment_agent_phones={receipt.payment_agent_phone}
                        payment_agent_urls={receipt.payment_agent_url}
                    />
                </div>
            )}
            <div className='cashier__form-submit'>
                {!is_from_derivgo && (
                    <Button
                        className='cashier__form-submit-button'
                        has_effect
                        text={localize('View transactions')}
                        onClick={() => openStatement(history, resetPaymentAgent)}
                        secondary
                        large
                    />
                )}
                <Button
                    className='cashier__form-submit-button cashier__done-button'
                    has_effect
                    text={localize('Make a new withdrawal')}
                    onClick={resetPaymentAgent}
                    primary
                    large
                />
            </div>
        </div>
    );
};

PaymentAgentReceipt.propTypes = {
    currency: PropTypes.string,
    history: PropTypes.object,
    is_from_derivgo: PropTypes.bool,
    loginid: PropTypes.string,
    receipt: PropTypes.object,
    resetPaymentAgent: PropTypes.func,
};

export default withRouter(
    connect(({ client, common, modules }) => ({
        currency: client.currency,
        is_from_derivgo: common.is_from_derivgo,
        loginid: client.loginid,
        receipt: modules.cashier.payment_agent.receipt,
        resetPaymentAgent: modules.cashier.payment_agent.resetPaymentAgent,
    }))(PaymentAgentReceipt)
);
