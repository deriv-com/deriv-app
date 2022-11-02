import classNames from 'classnames';
import React from 'react';
import { Field, FieldProps, Formik, Form } from 'formik';
import { Button, Input, Loading, Money, Text } from '@deriv/components';
import { PaymentAgentWithdrawRequest } from '@deriv/api-types';
import { getDecimalPlaces, getCurrencyDisplayCode, validNumber } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import ErrorDialog from 'Components/error-dialog';
import { TRootStore, TPaymentAgentDetails, TServerError } from 'Types';
import './payment-agent-listed-withdraw-form.scss';

type TValidateWithdrawalValueProps = {
    amount: string;
};

type TValidateWithdrawalProps = {
    balance: string;
    currency: string;
    payment_agent?: TPaymentAgentDetails;
};

type PaymentAgentListedWithdrawFormProps = {
    balance: string;
    currency: string;
    error: TServerError;
    is_crypto: boolean;
    is_loading: boolean;
    onMount: () => void;
    payment_agent: TPaymentAgentDetails;
    payment_agent_list: TPaymentAgentDetails[];
    requestTryPaymentAgentWithdraw: (arg: PaymentAgentWithdrawRequest) => {
        error?: string;
    };
    selected_bank: number | string;
    verification_code: string;
};

const validateWithdrawal = (
    values: TValidateWithdrawalValueProps,
    { balance, currency, payment_agent }: TValidateWithdrawalProps
) => {
    const errors: { payment_agent?: string; amount?: string } = {};

    const { is_ok, message } = validNumber(values.amount, {
        type: 'float',
        decimals: getDecimalPlaces(currency),
        ...(payment_agent?.min_withdrawal && {
            min: payment_agent?.min_withdrawal,
            max: payment_agent?.max_withdrawal,
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

const PaymentAgentListedWithdrawForm = ({
    balance,
    currency,
    error,
    is_crypto,
    is_loading,
    onMount,
    payment_agent,
    payment_agent_list,
    requestTryPaymentAgentWithdraw,
    selected_bank,
    verification_code,
}: PaymentAgentListedWithdrawFormProps) => {
    React.useEffect(() => {
        onMount();
    }, [onMount]);

    const input_ref = React.useRef<HTMLInputElement>();

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
        });

    const onWithdrawalPassthrough = async (
        values: TValidateWithdrawalValueProps,
        actions: { setSubmitting: (status: boolean) => void }
    ) => {
        const payment_agent_withdraw = await requestTryPaymentAgentWithdraw({
            paymentagent_loginid: payment_agent.paymentagent_loginid,
            currency,
            amount: Number(values.amount),
            verification_code,
            paymentagent_withdraw: 1,
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
                                                )?.min_withdrawal || ''
                                            }
                                            currency={payment_agent?.currency}
                                            show_currency
                                        />,
                                        <Money
                                            key={1}
                                            amount={
                                                payment_agent_list.find(
                                                    pa => pa.value === payment_agent.paymentagent_loginid
                                                )?.max_withdrawal || ''
                                            }
                                            currency={payment_agent?.currency}
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
                                {({ field }: FieldProps) => (
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
                                        maxLength='30'
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
};

export default connect(({ client, modules }: TRootStore) => ({
    balance: client.balance,
    currency: client.currency,
    error: modules.cashier.payment_agent.error,
    is_crypto: modules.cashier.general_store.is_crypto,
    is_loading: modules.cashier.general_store.is_loading,
    onMount: modules.cashier.payment_agent.onMountPaymentAgentWithdraw,
    payment_agent_list: modules.cashier.payment_agent.agents,
    requestTryPaymentAgentWithdraw: modules.cashier.payment_agent.requestTryPaymentAgentWithdraw,
    selected_bank: modules.cashier.payment_agent.selected_bank,
    verification_code: client.verification_code.payment_agent_withdraw,
}))(PaymentAgentListedWithdrawForm);
