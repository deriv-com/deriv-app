import classNames             from 'classnames';
import PropTypes              from 'prop-types';
import React                  from 'react';
import {
    Button,
    Input }                   from 'deriv-components';
import {
    Field,
    Formik,
    Form }                    from 'formik';
import CurrencyUtils          from 'deriv-shared/utils/currency';
import { localize, Localize } from 'deriv-translations';
import Icon                   from 'Assets/icon.jsx';
import { connect }            from 'Stores/connect';
import {
    getPreBuildDVRs,
    validNumber }             from 'Utils/Validator/declarative-validation-rules';

const validateTransfer = (values, { balance, currency, transfer_limit }) => {
    const errors = {};

    if (!values.loginid  || !/^[A-Za-z]+[0-9]+$/.test(values.loginid)) {
        errors.loginid = localize('Please enter a valid client login ID.');
    }

    if (!values.amount) {
        errors.amount = localize('This field is required.');
    } else if (
        !validNumber(values.amount, {
            type    : 'float',
            decimals: CurrencyUtils.getDecimalPlaces(currency),
            ...(transfer_limit.min && {
                min: transfer_limit.min,
                max: transfer_limit.max,
            }),
        })) {
        errors.amount = getPreBuildDVRs().number.message;
    } else if (+balance < +values.amount) {
        errors.amount = localize('Insufficient balance.');
    }

    if (values.description && !/^[0-9A-Za-z .,'-]{0,250}$/.test(values.description.replace(/\n/g, ' '))) {
        errors.description = localize('Please enter a valid description.');
    }

    return errors;
};

class PaymentAgentTransferForm extends React.Component {
    validateTransferPassthrough = (values) => (
        validateTransfer(values, {
            balance       : this.props.balance,
            currency      : this.props.currency,
            transfer_limit: this.props.transfer_limit,
        })
    );

    onTransferPassthrough = async (values, actions) => {
        const payment_agent_transfer = await this.props.requestPaymentAgentTransfer({
            amount     : values.amount,
            currency   : this.props.currency,
            description: values.description.replace(/\n/g, ' '),
            transfer_to: values.loginid,
        });
        if (payment_agent_transfer.error) {
            actions.setSubmitting(false);
        }
    };

    render() {
        return (
            <div className='cashier__wrapper--align-left'>
                <h2 className='cashier__header payment-agent-transfer__header'>
                    <Localize i18n_default_text='Transfer to client' />
                </h2>
                <Formik
                    initialValues={{
                        loginid    : '',
                        amount     : '',
                        description: '',
                    }}
                    validate={this.validateTransferPassthrough}
                    onSubmit={this.onTransferPassthrough}
                >
                    {
                        ({ errors, isSubmitting, isValid, touched, handleChange }) => (
                            <Form noValidate>
                                <Field name='loginid'>
                                    {({ field }) => (
                                        <Input
                                            { ...field }
                                            onChange={(e) => {
                                                this.props.setErrorMessage('');
                                                handleChange(e);
                                            }}
                                            className='payment-agent-transfer__input'
                                            type='text'
                                            label={localize('Client login ID')}
                                            error={ touched.loginid && errors.loginid }
                                            required
                                            autoComplete='off'
                                            maxLength='20'
                                        />
                                    )}
                                </Field>
                                <Field name='amount'>
                                    {({ field }) => (
                                        <Input
                                            { ...field }
                                            onChange={(e) => {
                                                this.props.setErrorMessage('');
                                                handleChange(e);
                                            }}
                                            className='payment-agent-transfer__input dc-input--no-placeholder'
                                            type='text'
                                            label={localize('Amount')}
                                            error={ touched.amount && errors.amount }
                                            required
                                            leading_icon={
                                                <span className={classNames('symbols', `symbols--${(this.props.currency || '').toLowerCase()}`)} />
                                            }
                                            autoComplete='off'
                                            maxLength='30'
                                        />
                                    )}
                                </Field>
                                <Field name='description'>
                                    {({ field }) => (
                                        <Input
                                            { ...field }
                                            onChange={(e) => {
                                                this.props.setErrorMessage('');
                                                handleChange(e);
                                            }}
                                            type='textarea'
                                            label={localize('Description')}
                                            error={ touched.description && errors.description }
                                            required
                                            autoComplete='off'
                                            maxLength='250'
                                        />
                                    )}
                                </Field>
                                <div className='cashier__form-submit'>
                                    {this.props.error_message &&
                                    <React.Fragment>
                                        <Icon icon='IconEmergency' className='cashier__form-error-icon' />
                                        <Icon icon='IconError' className='cashier__form-error-small-icon' />
                                        <p className='cashier__form-error'>
                                            {this.props.error_message}
                                        </p>
                                    </React.Fragment>
                                    }
                                    <Button
                                        className='cashier__form-submit-button'
                                        type='submit'
                                        is_disabled={!isValid || isSubmitting}
                                        primary
                                        large
                                    >
                                        <Localize i18n_default_text='Transfer' />
                                    </Button>
                                </div>
                            </Form>
                        )
                    }
                </Formik>
            </div>
        );
    }
}

PaymentAgentTransferForm.propTypes = {
    balance                    : PropTypes.string,
    currency                   : PropTypes.string,
    error                      : PropTypes.object,
    requestPaymentAgentTransfer: PropTypes.func,
    setErrorMessage            : PropTypes.func,
    transfer_limit             : PropTypes.object,
};

export default connect(
    ({ client, modules }) => ({
        balance                    : client.balance,
        currency                   : client.currency,
        error_message              : modules.cashier.config.payment_agent_transfer.error.message,
        requestPaymentAgentTransfer: modules.cashier.requestPaymentAgentTransfer,
        setErrorMessage            : modules.cashier.setErrorMessage,
        transfer_limit             : modules.cashier.config.payment_agent_transfer.transfer_limit,
    })
)(PaymentAgentTransferForm);
