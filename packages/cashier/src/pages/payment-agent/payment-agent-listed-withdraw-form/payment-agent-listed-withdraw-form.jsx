import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Formik, Form } from 'formik';
import { Button, Input, Loading, Money, Text } from '@deriv/components';
import { getDecimalPlaces, getCurrencyDisplayCode, validNumber } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import ErrorDialog from 'Components/error-dialog';
import './payment-agent-listed-withdraw-form.scss';

const validateWithdrawal = (values, { balance, currency, payment_agent = {} }) => {
    const errors = {};

    const { is_ok, message } = validNumber(values.amount, {
        type: 'float',
        decimals: getDecimalPlaces(currency),
        ...(payment_agent.min_withdrawal && {
            min: payment_agent.min_withdrawal,
            max: payment_agent.max_withdrawal,
        }),
    });

    if (!values.amount) {
        errors.amount = localize('This field is required.');
    } else if (!is_ok) {
        errors.amount = message;
    } else if (+balance < +values.amount) {
        errors.amount = localize('Insufficient balance.');
    }

    return errors;
};

const PaymentAgentListedWithdrawForm = observer(({ payment_agent }) => {
    const {
        client,
        modules: {
            cashier: { general_store, payment_agent: payment_agenr_store },
        },
    } = useStore();

    const {
        balance,
        currency,
        verification_code: { payment_agent_withdraw: verification_code },
    } = client;

    const { is_crypto, is_loading } = general_store;
    const {
        error,
        onMountPaymentAgentWithdraw: onMount,
        agents: payment_agent_list,
        requestTryPaymentAgentWithdraw,
        selected_bank,
    } = payment_agenr_store;

    React.useEffect(() => {
        onMount();
    }, [onMount]);

    const input_ref = React.useRef(null);

    React.useEffect(() => {
        if (input_ref.current) {
            input_ref.current.value = null;
        }
    }, [selected_bank]);

    const validateWithdrawalPassthrough = values =>
        validateWithdrawal(values, {
            balance,
            currency,
            payment_agent: payment_agent_list.find(pa => pa.value === payment_agent.paymentagent_loginid),
        });

    const onWithdrawalPassthrough = async (values, actions) => {
        const payment_agent_withdraw = await requestTryPaymentAgentWithdraw({
            loginid: payment_agent.paymentagent_loginid,
            currency,
            amount: values.amount,
            verification_code,
        });
        if (payment_agent_withdraw?.error) {
            actions.setSubmitting(false);
        }
    };

    if (is_loading || !payment_agent_list.length) {
        return <Loading className='cashier__loader' is_fullscreen={false} />;
    }

    return (
        <div className='payment-agent-listed-withdraw-form'>
            <Text as='p' className='payment-agent-listed-withdraw-form__header' line_height='s' size='xs' weight='bold'>
                <Localize i18n_default_text='Withdrawal amount' />
            </Text>
            <Formik
                initialValues={{
                    amount: '',
                }}
                validate={validateWithdrawalPassthrough}
                onSubmit={onWithdrawalPassthrough}
            >
                {({ errors, isSubmitting, isValid, touched, values }) => {
                    const getHint = () => {
                        return (
                            payment_agent_list.find(pa => pa.value === payment_agent.paymentagent_loginid) && (
                                <Localize
                                    i18n_default_text='Withdrawal limits: <0 />-<1 />'
                                    components={[
                                        <Money
                                            key={0}
                                            amount={
                                                payment_agent_list.find(
                                                    pa => pa.value === payment_agent.paymentagent_loginid
                                                ).min_withdrawal
                                            }
                                            currency={payment_agent.currency}
                                            show_currency
                                        />,
                                        <Money
                                            key={1}
                                            amount={
                                                payment_agent_list.find(
                                                    pa => pa.value === payment_agent.paymentagent_loginid
                                                ).max_withdrawal
                                            }
                                            currency={payment_agent.currency}
                                            show_currency
                                        />,
                                    ]}
                                />
                            )
                        );
                    };
                    return (
                        <Form className='payment-agent-listed-withdraw-form__form'>
                            <Field name='amount'>
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        className={classNames('dc-input--no-placeholder', {
                                            'dc-input--crypto-hint': is_crypto,
                                        })}
                                        type='text'
                                        label={localize('Enter amount')}
                                        error={touched.amount && errors.amount}
                                        required
                                        autoComplete='off'
                                        maxLength={30}
                                        hint={getHint()}
                                        ref={input_ref}
                                        trailing_icon={
                                            <span
                                                className={classNames('symbols', `symbols--${currency.toLowerCase()}`)}
                                            >
                                                {getCurrencyDisplayCode(currency)}
                                            </span>
                                        }
                                    />
                                )}
                            </Field>
                            <Button
                                type='submit'
                                is_disabled={!isValid || isSubmitting || !values.amount}
                                primary
                                large
                            >
                                <Localize i18n_default_text='Continue' />
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
            <ErrorDialog error={error} className='payment-agent-list__error-dialog' />
        </div>
    );
});

PaymentAgentListedWithdrawForm.propTypes = {
    payment_agent: PropTypes.object,
};

export default PaymentAgentListedWithdrawForm;
