import classNames from 'classnames';
import React from 'react';
import { Field, FieldProps, Formik, Form } from 'formik';
import { Button, Input, Loading, Money, Text } from '@deriv/components';
import { getDecimalPlaces, getCurrencyDisplayCode, validNumber } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import ErrorDialog from 'Components/error-dialog';
import { useCashierStore } from '../../../stores/useCashierStores';
import './payment-agent-listed-withdraw-form.scss';
import { TPaymentAgent } from '../../../types';

type TValidateWithdrawalValueProps = {
    amount: string;
};

type TValidateWithdrawalProps = {
    balance: string;
    currency: string;
    payment_agent: TPaymentAgent;
};

type TPaymentAgentListedWithdrawForm = {
    payment_agent: TPaymentAgent;
};

const validateWithdrawal = (
    values: TValidateWithdrawalValueProps,
    { balance, currency, payment_agent }: TValidateWithdrawalProps
) => {
    const errors: { amount?: string } = {};

    const { is_ok, message } = validNumber(values.amount, {
        type: 'float',
        decimals: getDecimalPlaces(currency),
        ...(payment_agent.min_withdrawal && {
            min: Number(payment_agent.min_withdrawal),
            max: payment_agent.max_withdrawal ? Number(payment_agent.max_withdrawal) : undefined,
        }),
    });

    if (!values.amount) {
        errors.amount = localize('This field is required.');
    } else if (!is_ok && message) {
        errors.amount = message;
    } else if (Number(balance) < Number(values.amount)) {
        errors.amount = localize('Insufficient balance.');
    }

    return errors;
};

const PaymentAgentListedWithdrawForm = observer(({ payment_agent }: TPaymentAgentListedWithdrawForm) => {
    const { client } = useStore();
    const { general_store, payment_agent: payment_agent_store } = useCashierStore();
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
    } = payment_agent_store;

    React.useEffect(() => {
        onMount();
    }, [onMount]);

    const input_ref = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (input_ref.current) {
            input_ref.current.value = '';
        }
    }, [selected_bank]);

    const validateWithdrawalPassthrough = (values: TValidateWithdrawalValueProps) =>
        validateWithdrawal(values, {
            balance,
            currency,
            payment_agent: payment_agent_list.find(pa => pa.value === payment_agent.paymentagent_loginid),
        } as TValidateWithdrawalProps);

    const onWithdrawalPassthrough = async (values: TValidateWithdrawalValueProps) => {
        await requestTryPaymentAgentWithdraw({
            loginid: payment_agent.paymentagent_loginid,
            currency,
            amount: Number(values.amount),
            verification_code,
        });
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
                                    i18n_default_text='Withdrawal limits: <0 /> - <1 />'
                                    components={[
                                        <Money
                                            className='payment-agent-listed-withdraw-form__hint-amount'
                                            key={0}
                                            amount={
                                                payment_agent_list.find(
                                                    pa => pa.value === payment_agent.paymentagent_loginid
                                                )?.min_withdrawal || ''
                                            }
                                            currency={payment_agent.currency}
                                            show_currency
                                        />,
                                        <Money
                                            className='payment-agent-listed-withdraw-form__hint-amount'
                                            key={1}
                                            amount={
                                                payment_agent_list.find(
                                                    pa => pa.value === payment_agent.paymentagent_loginid
                                                )?.max_withdrawal || ''
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
                        <Form className='payment-agent-listed-withdraw-form__container'>
                            <Field name='amount'>
                                {({ field }: FieldProps) => (
                                    <Input
                                        {...field}
                                        className={classNames('dc-input--no-placeholder', {
                                            'dc-input--crypto-hint': is_crypto,
                                        })}
                                        type='text'
                                        label={localize('Enter amount')}
                                        error={(touched.amount && errors.amount) || ''}
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

export default PaymentAgentListedWithdrawForm;
