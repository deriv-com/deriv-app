import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { Formik, Field } from 'formik';
import { routes } from '@deriv/shared';
import { withRouter } from 'react-router-dom';
import { connect } from 'Stores/connect';
import 'Sass/payment-agent-withdraw-justification-form.scss';

const JustificationReceived = () => {
    return (
        <div className='cashier__wrapper--align-center payment-agent-withdrawal-justification-confirmation'>
            <Icon
                icon='IcCashierRequestReceived'
                className='payment-agent-withdrawal-justification-confirmation__request-received-icon'
                size={116}
            />
            <Text
                as='h2'
                weight='bold'
                align='center'
                className='payment-agent-withdrawal-justification-confirmation__title'
            >
                <Localize i18n_default_text='We have received your request' />
            </Text>
            <Text as='p' size='xs' line_height='s' align='center'>
                <Localize i18n_default_text='Thank you for your information. We will email you soon to let you know how we can help you.' />
            </Text>
        </div>
    );
};

const PaymentAgentWithdrawJustificationForm = ({
    currency,
    history,
    is_justification_recieved,
    loginid,
    requestTrySendPaymentAgentWithdrawJustification,
}) => {
    const character_limit_no = 250;

    const handleSubmitForm = (values, actions) => {
        actions.setSubmitting(true);
        requestTrySendPaymentAgentWithdrawJustification({
            loginid,
            currency,
            amount: 0,
            verification_code: 'dummy_verification_code',
            client_justification: values.justification.replace(/\n/g, ' '),
            setSubmitting: actions.setSubmitting,
        });
    };

    const handleValidate = values => {
        const errors = {};
        if (values.justification && !/^[0-9A-Za-z .,'-]{0,250}$/.test(values.justification.replace(/\n/g, ' '))) {
            errors.justification = localize(
                'Please use only letters, numbers, commas, single quotation marks, hyphens, and periods.'
            );
        }
        return errors;
    };

    if (is_justification_recieved) {
        return <JustificationReceived />;
    }

    return (
        <div className='cashier__wrapper--align-center payment-agent-withdrawal-justification-form'>
            <Text
                align='center'
                as='p'
                className='payment-agent-withdrawal-justification-form__text'
                line_height='s'
                size='xs'
            >
                {localize(
                    'It’s best to withdraw using the same payment method as you used to deposit. If that’s not possible, tell us why below and click submit to request payment agent withdrawals.'
                )}
            </Text>
            <Formik initialValues={{ justification: '' }} onSubmit={handleSubmitForm} validate={handleValidate}>
                {({ values, handleSubmit, isSubmitting, errors }) => (
                    <form onSubmit={handleSubmit}>
                        <Field name='justification'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete='off'
                                    className='payment-agent-withdrawal-justification-form__input'
                                    data-lpignore='true'
                                    error={errors.justification}
                                    has_character_counter
                                    max_characters={character_limit_no}
                                    name='justification'
                                    placeholder={localize(
                                        'Reason for not using the same payment method for withdrawal as you used for deposit'
                                    )}
                                    type='textarea'
                                    value={values.justification}
                                />
                            )}
                        </Field>
                        <Button.Group>
                            <Button
                                className='payment-agent-withdrawal-justification-form__btn-back'
                                disabled={isSubmitting}
                                onClick={() => history.push(routes.cashier_withdrawal)}
                                type='button'
                                secondary
                                small
                            >
                                <Localize i18n_default_text='Go back to payment methods options' />
                            </Button>
                            <Button
                                disabled={errors.justification || isSubmitting || !values.justification.length}
                                large
                                primary
                                type='submit'
                            >
                                <Localize i18n_default_text='Submit' />
                            </Button>
                        </Button.Group>
                    </form>
                )}
            </Formik>
        </div>
    );
};

PaymentAgentWithdrawJustificationForm.propTypes = {
    currency: PropTypes.string,
    history: PropTypes.object,
    is_justification_recieved: PropTypes.bool,
    loginid: PropTypes.string,
    requestTrySendPaymentAgentWithdrawJustification: PropTypes.func,
};

export default withRouter(
    connect(({ client, modules }) => ({
        currency: client.currency,
        is_justification_recieved: modules.cashier.payment_agent.is_justification_recieved,
        loginid: client.loginid,
        requestTrySendPaymentAgentWithdrawJustification:
            modules.cashier.payment_agent.requestTrySendPaymentAgentWithdrawJustification,
    }))(PaymentAgentWithdrawJustificationForm)
);
