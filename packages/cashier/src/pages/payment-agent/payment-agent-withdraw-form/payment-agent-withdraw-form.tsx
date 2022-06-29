import classNames from 'classnames';
import { RootStore } from 'Types';
import React from 'react';
import { Field, Formik, Form } from 'formik';
import {
    Button,
    DesktopWrapper,
    Dropdown,
    Input,
    Loading,
    MobileWrapper,
    Money,
    SelectNative,
    Text,
} from '@deriv/components';
import { getDecimalPlaces, getCurrencyDisplayCode, validNumber } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import PaymentAgentWithdrawConfirm from '../payment-agent-withdraw-confirm';
import ErrorDialog from 'Components/error-dialog';
import PaymentAgentReceipt from '../payment-agent-receipt';
import './payment-agent-withdraw-form.scss';

type TValidateWithdrawalValueProps = {
    payment_method: string;
    payment_agents: string | undefined;
    payment_agent: string;
    amount: string;
    [key: string]: string | undefined;
};

type TValidateWithdrawalProps = {
    balance: string;
    currency: string;
    payment_agent?: {
        min_withdrawal?: string;
        max_withdrawal?: string;
        value?: string;
        text?: string;
    };
};

type TRadioProps = {
    children?: string | JSX.Element | JSX.Element[];
    field: {
        value?: string;
        name?: string;
        onChange?: () => void;
    };
    propsItems: {
        id?: string | undefined;
        className?: string;
    };
};

type TRadioDropDownProps = {
    values: {
        payment_agents: string;
    };
    field: {
        value?: string;
        name?: string;
        onChange?: () => void;
    };
    payment_agent_list: Array<string>;
    id?: string | undefined;
};

type TRadioInputProps = {
    touched: {
        payment_agent: string;
    };
    errors: {
        payment_agent: string;
    };
    field: {
        value?: string;
        name?: string;
        onChange?: () => void;
    };
    values: {
        payment_agent: string;
    };
    id?: string | undefined;
};

type TPaymentAgentWithdrawFormProps = {
    amount: string;
    balance: string;
    currency: string;
    error: string;
    error_message_withdraw: string;
    is_loading: boolean;
    is_try_withdraw_successful: boolean;
    is_withdraw_successful: boolean;
    onMount: () => void;
    payment_agent_id: string;
    payment_agent_list: Array<TValidateWithdrawalProps['payment_agent']>;
    payment_agent_name: string;
    requestTryPaymentAgentWithdraw: (arg: {
        loginid: string | number | undefined;
        currency: string;
        amount: string;
        verification_code: string;
    }) => {
        error?: string;
    };
    resetPaymentAgent: () => void;
    verification_code: string;
};

const validateWithdrawal = (
    values: TValidateWithdrawalValueProps,
    { balance, currency, payment_agent = {} }: TValidateWithdrawalProps
) => {
    const errors: { payment_agent?: string; amount?: string } = {};

    if (
        values.payment_method === 'payment_agent' &&
        (!values.payment_agent || !/^[A-Za-z]+[0-9]+$/.test(values.payment_agent))
    ) {
        errors.payment_agent = localize('Please enter a valid payment agent ID.');
    }

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

// TODO: refactor this to use the main radio component for forms too if possible
const Radio = ({ children, field, propsItems }: TRadioProps) => (
    <div className='payment-agent-withdraw-form__radio-container'>
        <input
            id={propsItems.id}
            className={propsItems.className}
            name={field.name}
            value={propsItems.id}
            checked={field.value === propsItems.id}
            onChange={field.onChange}
            type='radio'
        />
        <label htmlFor={propsItems.id} className='payment-agent-withdraw-form__radio-wrapper'>
            <span
                className={classNames('payment-agent-withdraw-form__radio-circle', {
                    'payment-agent-withdraw-form__radio-circle--selected': field.value === propsItems.id,
                })}
            />
            {children}
        </label>
    </div>
);

const RadioDropDown = ({ field, values, ...props }: TRadioDropDownProps) => (
    <Radio field={field} propsItems={props}>
        <Text as='p' size='xxs' line_height='s' className='payment-agent-withdraw-form__radio-label cashier__paragraph'>
            <Localize i18n_default_text='By name' />
        </Text>
        <Field name='payment_agents'>
            {(params: { form: { setFieldValue: (arg0: string, arg1: string | undefined) => void } }) => (
                <React.Fragment>
                    <DesktopWrapper>
                        <Dropdown
                            placeholder={localize('Choose an agent')}
                            is_align_text_left
                            className='payment-agent-withdraw-form__drop-down'
                            classNameDisplay='cashier__drop-down-display'
                            classNameDisplaySpan='cashier__drop-down-display-span'
                            classNameItems='cashier__drop-down-items'
                            list={props.payment_agent_list}
                            value={values.payment_agents}
                            onChange={(e: { target: { value: string } }) => {
                                params.form.setFieldValue('payment_agents', e.target.value);
                                params.form.setFieldValue('payment_method', props.id);
                            }}
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <SelectNative
                            placeholder={localize('Please select')}
                            name='payment_methods'
                            className='payment-agent-withdraw-form__drop-down'
                            list_items={props.payment_agent_list}
                            value={values.payment_agents}
                            label={localize('Choose agent')}
                            should_show_empty_option={false}
                            onChange={(e: { target: { value: string } }) => {
                                params.form.setFieldValue('payment_agents', e.target.value);
                                params.form.setFieldValue('payment_method', props.id);
                            }}
                            use_text={false}
                        />
                    </MobileWrapper>
                </React.Fragment>
            )}
        </Field>
    </Radio>
);

const RadioInput = ({ touched, errors, field, values, ...props }: TRadioInputProps) => (
    <Radio field={field} propsItems={props}>
        <Text as='p' size='xxs' line_height='s' className='payment-agent-withdraw-form__radio-label cashier__paragraph'>
            <Localize i18n_default_text='By payment agent ID' />
        </Text>
        <Field>
            {(params: {
                field: { onChange: () => void; onBlur: () => void };
                form: { setFieldValue: (arg0: string, arg1: string | undefined) => void };
            }) => (
                <Input
                    name='payment_agent'
                    className='payment-agent-withdraw-form__input'
                    classNameError='payment-agent-withdraw-form__input-error'
                    data-testid='dt_cashier_input_payment_agent'
                    type='text'
                    placeholder='CR'
                    error={touched.payment_agent && errors.payment_agent}
                    autoComplete='off'
                    maxLength='20'
                    value={values.payment_agent}
                    onChange={params.field.onChange}
                    onFocus={() => {
                        params.form.setFieldValue('payment_method', props.id);
                    }}
                    onBlur={params.field.onBlur}
                />
            )}
        </Field>
    </Radio>
);

const PaymentAgentWithdrawForm = ({
    amount,
    balance,
    currency,
    error,
    is_loading,
    is_try_withdraw_successful,
    is_withdraw_successful,
    onMount,
    payment_agent_id,
    payment_agent_list,
    payment_agent_name,
    requestTryPaymentAgentWithdraw,
    resetPaymentAgent,
    verification_code,
}: TPaymentAgentWithdrawFormProps) => {
    React.useEffect(() => {
        onMount();

        return () => {
            resetPaymentAgent();
        };
    }, [onMount, resetPaymentAgent]);

    const validateWithdrawalPassthrough = (values: TValidateWithdrawalValueProps) =>
        validateWithdrawal(values, {
            balance,
            currency,
            payment_agent: payment_agent_list.find(pa => pa?.value === values[values.payment_method]),
        });

    const onWithdrawalPassthrough = async (
        values: TValidateWithdrawalValueProps,
        actions: { setSubmitting: (status: boolean) => void }
    ) => {
        const payment_agent_withdraw = await requestTryPaymentAgentWithdraw({
            loginid: values[values.payment_method],
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
    if (is_try_withdraw_successful) {
        return <PaymentAgentWithdrawConfirm verification_code={verification_code} />;
    }
    if (is_withdraw_successful) {
        return <PaymentAgentReceipt />;
    }
    const should_fill_id = !payment_agent_name && payment_agent_id;

    return (
        <div
            className='cashier__wrapper--align-center payment-agent-withdraw-form__withdrawal'
            data-testid='dt_payment_agent_withdraw_form'
        >
            <Text
                as='p'
                size='s'
                weight='bold'
                align='center'
                color='prominent'
                className='cashier__header payment-agent-withdraw-form__withdrawal-header'
            >
                <Localize i18n_default_text='Payment agent withdrawal' />
            </Text>
            <Formik
                initialValues={{
                    // in case coming back from confirmation screen, populate the recent data to be edited
                    amount: amount || '',
                    payment_agent: should_fill_id ? payment_agent_id : '',
                    payment_agents:
                        should_fill_id || !payment_agent_name
                            ? payment_agent_list[0]?.value
                            : payment_agent_list.find(pa => pa?.text === payment_agent_name)?.value,
                    payment_method: should_fill_id ? 'payment_agent' : 'payment_agents',
                }}
                validate={validateWithdrawalPassthrough}
                onSubmit={onWithdrawalPassthrough}
            >
                {({ errors, isSubmitting, isValid, values, touched }) => {
                    const getHint = () => {
                        const getHintText = (payment_agent: string | TValidateWithdrawalProps['payment_agent']) => {
                            return (
                                payment_agent_list.find(pa => pa?.value === payment_agent) && (
                                    <Localize
                                        i18n_default_text='Withdrawal limits: <0 />-<1 />'
                                        components={[
                                            <Money
                                                key={0}
                                                amount={
                                                    payment_agent_list.find(pa => pa?.value === payment_agent)
                                                        ?.min_withdrawal
                                                }
                                                currency={currency}
                                            />,
                                            <Money
                                                key={1}
                                                amount={
                                                    payment_agent_list.find(pa => pa?.value === payment_agent)
                                                        ?.max_withdrawal
                                                }
                                                currency={currency}
                                            />,
                                        ]}
                                    />
                                )
                            );
                        };
                        switch (values.payment_method) {
                            case 'payment_agents':
                                return getHintText(values.payment_agents);
                            case 'payment_agent':
                                return getHintText(values.payment_agent);
                            default:
                                return <></>;
                        }
                    };

                    return (
                        <Form>
                            <div className='payment-agent-withdraw-form__radio-group'>
                                <Field
                                    id='payment_agents'
                                    component={RadioDropDown}
                                    payment_agent_list={payment_agent_list}
                                    className='payment-agent-withdraw-form__radio'
                                    name='payment_method'
                                    values={values}
                                />
                                <Field
                                    id='payment_agent'
                                    component={RadioInput}
                                    touched={touched}
                                    errors={errors}
                                    values={values}
                                    className='payment-agent-withdraw-form__radio'
                                    name='payment_method'
                                />
                            </div>
                            <Field name='amount'>
                                {({ field }: { [k: string]: string | object }) => (
                                    <Input
                                        {...(field as object)}
                                        className='cashier__input dc-input--no-placeholder'
                                        type='text'
                                        label={localize('Amount')}
                                        error={touched.amount && errors.amount}
                                        data-testid='dt_cashier_input_amount'
                                        required
                                        leading_icon={
                                            <span
                                                className={classNames('symbols', `symbols--${currency.toLowerCase()}`)}
                                            >
                                                {getCurrencyDisplayCode(currency)}
                                            </span>
                                        }
                                        autoComplete='off'
                                        maxLength='30'
                                        hint={getHint()}
                                    />
                                )}
                            </Field>
                            <div className='cashier__form-submit'>
                                <Button
                                    className='cashier__form-submit-button'
                                    type='submit'
                                    is_disabled={!isValid || isSubmitting}
                                    primary
                                    large
                                >
                                    <Localize i18n_default_text='Withdraw' />
                                </Button>
                            </div>
                            <ErrorDialog error={error} />
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default connect(({ client, modules }: RootStore) => ({
    amount: modules.cashier.payment_agent.confirm.amount,
    balance: client.balance,
    currency: client.currency,
    error: modules.cashier.payment_agent.error,
    is_loading: modules.cashier.general_store.is_loading,
    is_try_withdraw_successful: modules.cashier.payment_agent.is_try_withdraw_successful,
    is_withdraw_successful: modules.cashier.payment_agent.is_withdraw_successful,
    onMount: modules.cashier.payment_agent.onMountPaymentAgentWithdraw,
    payment_agent_id: modules.cashier.payment_agent.confirm.loginid,
    payment_agent_list: modules.cashier.payment_agent.agents,
    payment_agent_name: modules.cashier.payment_agent.confirm.payment_agent_name,
    requestTryPaymentAgentWithdraw: modules.cashier.payment_agent.requestTryPaymentAgentWithdraw,
    resetPaymentAgent: modules.cashier.payment_agent.resetPaymentAgent,
}))(PaymentAgentWithdrawForm);
