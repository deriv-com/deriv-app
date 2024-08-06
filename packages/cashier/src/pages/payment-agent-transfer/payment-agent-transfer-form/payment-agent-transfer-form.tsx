import classNames from 'classnames';
import React from 'react';
import { Field, FieldProps, Formik, Form } from 'formik';
import { Button, Input, Text } from '@deriv/components';
import { getDecimalPlaces, validNumber, getCurrencyDisplayCode } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import ErrorDialog from '../../../components/error-dialog';
import { useCashierStore } from '../../../stores/useCashierStores';
import './payment-agent-transfer-form.scss';
import { TTransferLimit } from '../../../types';

type TValidateTransferProps = {
    balance: string;
    currency: string;
    transfer_limit: TTransferLimit;
};

const validateTransfer = (
    values: { loginid: string; amount: string; description: string },
    { balance, currency, transfer_limit }: TValidateTransferProps
) => {
    const errors = { loginid: '', amount: '', description: '' };

    if (!values.loginid || !/^[A-Za-z]+\d+$/.test(values.loginid)) {
        errors.loginid = localize('Please enter a valid client login ID.');
    }

    const { is_ok, message } = validNumber(values.amount, {
        type: 'float',
        decimals: getDecimalPlaces(currency),
        ...(transfer_limit.min_withdrawal && {
            min: Number(transfer_limit.min_withdrawal),
            max:
                Number(balance) >= Number(transfer_limit.min_withdrawal) &&
                transfer_limit.max_withdrawal &&
                Number(balance) < Number(transfer_limit.max_withdrawal)
                    ? Number(balance)
                    : Number(transfer_limit.max_withdrawal),
        }),
    });

    if (!values.amount) {
        errors.amount = localize('This field is required.');
    } else if (Number(balance) < Number(values.amount)) {
        errors.amount = localize('Insufficient balance.');
    } else if (!is_ok && message) {
        errors.amount = message;
    }

    if (values.description && !/^[0-9A-Za-z .,'-]{0,250}$/.test(values.description.replace(/\n/g, ' '))) {
        errors.description = localize('Please enter a valid description.');
    }

    return Object.fromEntries(Object.entries(errors).filter(([_, v]) => !!v));
};

const PaymentAgentTransferForm = observer(() => {
    const { client } = useStore();
    const { balance, currency } = client;
    const { isDesktop } = useDevice();
    const { payment_agent_transfer: payment_agent_transfer_store } = useCashierStore();
    const {
        confirm: { amount, description, client_id: transfer_to },
        error,
        requestTryPaymentAgentTransfer,
        transfer_limit,
    } = payment_agent_transfer_store;
    const { setErrorMessage } = error;

    const validateTransferPassthrough = (values: { loginid: string; amount: string; description: string }) =>
        validateTransfer(values, {
            balance: balance !== undefined ? String(balance) : '',
            currency,
            transfer_limit,
        });

    const onTransferPassthrough = async (
        values: { loginid: string; amount: string; description: string },
        actions: { setSubmitting: (value: boolean) => void }
    ) => {
        const payment_agent_transfer = await requestTryPaymentAgentTransfer({
            amount: Number(values.amount),
            currency,
            description: values.description.replace(/\n/g, ' '),
            transfer_to: values.loginid,
        });
        if (payment_agent_transfer.error) {
            actions.setSubmitting(false);
        }
    };

    // in case coming back from confirmation screen, populate the recent data to be edited
    const initial_transfer_form_values = {
        loginid: transfer_to || '',
        amount: amount?.toString() || '',
        description: description || '',
    };

    return (
        <div
            className='cashier__wrapper payment-agent-transfer-form__container'
            data-testid='dt_payment_agent_transfer_form_container'
        >
            {isDesktop && (
                <Text as='h2' color='prominent' weight='bold' align='center' className='cashier__header'>
                    <Localize i18n_default_text='Transfer to client' />
                </Text>
            )}
            <Formik
                initialValues={initial_transfer_form_values}
                isInitialValid={!Object.keys(validateTransferPassthrough(initial_transfer_form_values)).length}
                validate={validateTransferPassthrough}
                onSubmit={onTransferPassthrough}
            >
                {({ errors, isSubmitting, isValid, touched, handleChange }) => (
                    <Form noValidate className='payment-agent-transfer-form'>
                        <Field name='loginid'>
                            {({ field }: FieldProps) => (
                                <Input
                                    {...field}
                                    onChange={e => {
                                        setErrorMessage({ code: '', message: '' });
                                        handleChange(e);
                                    }}
                                    className='payment-agent-transfer-form__input'
                                    data-testid='dt_payment_agent_transfer_form_input_loginid'
                                    type='text'
                                    label={localize('Client account number')}
                                    error={(touched.loginid && errors.loginid) || ''}
                                    required
                                    autoComplete='off'
                                    maxLength={20}
                                />
                            )}
                        </Field>
                        <Field name='amount'>
                            {({ field }: FieldProps) => (
                                <Input
                                    {...field}
                                    onChange={e => {
                                        setErrorMessage({ code: '', message: '' });
                                        handleChange(e);
                                    }}
                                    className='payment-agent-transfer-form__input dc-input--no-placeholder'
                                    data-testid='dt_payment_agent_transfer_form_input_amount'
                                    type='text'
                                    label={localize('Amount')}
                                    error={(touched.amount && errors.amount) || ''}
                                    required
                                    trailing_icon={
                                        <span
                                            className={classNames(
                                                'symbols',
                                                `symbols--${(currency || '').toLowerCase()}`
                                            )}
                                        >
                                            {getCurrencyDisplayCode(currency)}
                                        </span>
                                    }
                                    autoComplete='off'
                                    maxLength={30}
                                />
                            )}
                        </Field>
                        <Field name='description'>
                            {({ field }: FieldProps) => (
                                <Input
                                    {...field}
                                    onChange={e => {
                                        setErrorMessage({ code: '', message: '' });
                                        handleChange(e);
                                    }}
                                    className='payment-agent-transfer-form__input-area'
                                    data-testid='dt_payment_agent_transfer_form_input_description'
                                    type='textarea'
                                    label={localize('Description')}
                                    error={errors.description}
                                    required
                                    autoComplete='off'
                                    has_character_counter
                                    max_characters={250}
                                />
                            )}
                        </Field>
                        <div className='cashier__form-submit'>
                            <Button
                                className='cashier__form-submit-button payment-agent-transfer-form__submit-button'
                                type='submit'
                                is_disabled={!isValid || isSubmitting}
                                primary
                                large
                            >
                                <Localize i18n_default_text='Transfer' />
                            </Button>
                        </div>
                        <ErrorDialog error={error} />
                    </Form>
                )}
            </Formik>
        </div>
    );
});

export default PaymentAgentTransferForm;
