import classNames             from 'classnames';
import PropTypes              from 'prop-types';
import React                  from 'react';
import {
    Button,
    Dropdown,
    Input,
    Money }                   from 'deriv-components';
import {
    Field,
    Formik,
    Form }                    from 'formik';
import CurrencyUtils          from 'deriv-shared/utils/currency';
import { localize, Localize } from 'deriv-translations';
import { connect }            from 'Stores/connect';
import {
    validNumber,
    getPreBuildDVRs }         from 'Utils/Validator/declarative-validation-rules';
import PaymentAgentReceipt    from './payment-agent-receipt.jsx';
import Error                  from '../error.jsx';
import Loading                from '../../../../templates/_common/components/loading.jsx';

const validateWithdrawal = (values, { balance, currency, payment_agent }) => {
    const errors = {};

    if (values.payment_method === 'payment_agent' && (!values.payment_agent || !/^[A-Za-z]+[0-9]+$/.test(values.payment_agent))) {
        errors.payment_agent = localize('Please enter a valid payment agent ID.');
    }

    if (!values.amount) {
        errors.amount = localize('This field is required.');
    } else if (!validNumber(
        values.amount,
        {
            type    : 'float',
            decimals: CurrencyUtils.getDecimalPlaces(currency),
            ...(payment_agent.min_withdrawal && {
                min: payment_agent.min_withdrawal,
                max: payment_agent.max_withdrawal,
            }),
        },
    )) {
        errors.amount = getPreBuildDVRs().number.message;
    } else if (+balance < +values.amount) {
        errors.amount = localize('Insufficient balance.');
    }

    return errors;
};

// TODO: refactor this to use the main radio component for forms too if possible
const Radio = ({
    children,
    field,
    props,
}) => (
    <div>
        <input
            id={props.id}
            className={props.className}
            name={field.name}
            value={props.id}
            checked={field.value === props.id}
            onChange={field.onChange}
            type='radio'
        />
        <label htmlFor={props.id} className='payment-agent__radio-wrapper'>
            <span
                className={ classNames('payment-agent__radio-circle', {
                    'payment-agent__radio-circle--selected': field.value === props.id,
                }) }
            />
            {children}
        </label>
    </div>
);

const RadioDropDown = ({
    field,
    values,
    ...props
}) => (
    <Radio field={field} props={props}>
        <span className='payment-agent__radio-label cashier__paragraph'>
            <Localize i18n_default_text='By name' />
        </span>
        <Field name='payment_agents'>
            {(params) => (
                <Dropdown
                    className='cashier__drop-down payment-agent__drop-down'
                    classNameDisplay='cashier__drop-down-display'
                    classNameDisplaySpan='cashier__drop-down-display-span'
                    classNameItems='cashier__drop-down-items'
                    list={props.payment_agent_list}
                    value={values.payment_agents}
                    onChange={(e) => {
                        params.form.setFieldValue('payment_agents', e.target.value);
                    }}
                />
            )}
        </Field>
    </Radio>
);

const RadioInput = ({
    touched,
    errors,
    field,
    values,
    ...props
}) => (
    <Radio field={field} props={props}>
        <span className='payment-agent__radio-label cashier__paragraph'>
            <Localize i18n_default_text='By payment agent ID' />
        </span>
        <Field>
            {(params) => (
                <Input
                    name='payment_agent'
                    className='payment-agent__input'
                    classNameError='payment-agent__input-error'
                    type='text'
                    placeholder='CR'
                    error={ touched.payment_agent && errors.payment_agent }
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

class PaymentAgentWithdraw extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.resetPaymentAgent();
    }

    validateWithdrawalPassthrough = (values) => (
        validateWithdrawal(values, {
            balance      : this.props.balance,
            currency     : this.props.currency,
            payment_agent: values.payment_method === 'payment_agent'
                ? {}
                : this.props.payment_agent_list.find(pa => pa.value === values.payment_agents),
        })
    );

    onWithdrawalPassthrough = (values) => {
        this.props.requestPaymentAgentWithdraw({
            loginid          : values[values.payment_method],
            currency         : this.props.currency,
            amount           : values.amount,
            verification_code: this.props.verification_code,
        });
    };

    render() {
        if (this.props.is_loading) {
            return <Loading className='cashier__loader' />;
        }
        if (this.props.error.message) {
            return <Error error={this.props.error} />;
        }
        if (this.props.is_withdraw_successful) {
            return <PaymentAgentReceipt />;
        }
        return (
            <div className='cashier__wrapper--align-left'>
                <h2 className='cashier__header'>
                    <Localize i18n_default_text='Payment agent withdrawal' />
                </h2>
                <Formik
                    initialValues={{
                        amount        : '',
                        payment_agent : '',
                        payment_agents: (this.props.payment_agent_list[0] || {}).value,
                        payment_method: 'payment_agents',
                    }}
                    validate={this.validateWithdrawalPassthrough}
                    onSubmit={this.onWithdrawalPassthrough}
                >
                    {({ errors, isSubmitting, isValid, values, touched }) => (
                        <Form>
                            <div className='payment-agent__radio-group'>
                                <Field
                                    id='payment_agents'
                                    component={RadioDropDown}
                                    payment_agent_list={this.props.payment_agent_list}
                                    className='payment-agent__radio'
                                    name='payment_method'
                                    values={values}
                                />
                                <Field
                                    id='payment_agent'
                                    component={RadioInput}
                                    touched={touched}
                                    errors={errors}
                                    values={values}
                                    className='payment-agent__radio'
                                    name='payment_method'
                                />
                            </div>
                            <Field name='amount'>
                                {({ field }) => (
                                    <Input
                                        { ...field }
                                        className='cashier__input cashier__input--short dc-input--no-placeholder'
                                        type='text'
                                        label={localize('Amount')}
                                        error={ touched.amount && errors.amount }
                                        required
                                        leading_icon={<span className={classNames('symbols', `symbols--${this.props.currency.toLowerCase()}`)} />}
                                        autoComplete='off'
                                        maxLength='30'
                                        hint={
                                            values.payment_method === 'payment_agents' &&
                                            this.props.payment_agent_list.find(
                                                pa => pa.value === values.payment_agents
                                            ) &&
                                            <Localize
                                                i18n_default_text='Withdrawal limits: <0 />-<1 />'
                                                components={[
                                                    <Money
                                                        key={0}
                                                        amount={this.props.payment_agent_list
                                                            .find(pa => pa.value === values.payment_agents)
                                                            .min_withdrawal}
                                                        currency={this.props.currency}
                                                    />,
                                                    <Money
                                                        key={1}
                                                        amount={this.props.payment_agent_list
                                                            .find(pa => pa.value === values.payment_agents)
                                                            .max_withdrawal}
                                                        currency={this.props.currency}
                                                    />,
                                                ]}
                                            />
                                        }
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
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}

PaymentAgentWithdraw.propTypes = {
    balance                    : PropTypes.string,
    currency                   : PropTypes.string,
    error_message_withdraw     : PropTypes.string,
    is_loading                 : PropTypes.bool,
    is_withdraw_successful     : PropTypes.bool,
    onMount                    : PropTypes.func,
    payment_agent_list         : PropTypes.array,
    requestPaymentAgentWithdraw: PropTypes.func,
    resetPaymentAgent          : PropTypes.func,
    verification_code          : PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        balance                    : client.balance,
        currency                   : client.currency,
        error                      : modules.cashier.config.payment_agent.error,
        is_loading                 : modules.cashier.is_loading,
        is_withdraw_successful     : modules.cashier.config.payment_agent.is_withdraw_successful,
        onMount                    : modules.cashier.onMountPaymentAgentWithdraw,
        payment_agent_list         : modules.cashier.config.payment_agent.agents,
        requestPaymentAgentWithdraw: modules.cashier.requestPaymentAgentWithdraw,
        resetPaymentAgent          : modules.cashier.resetPaymentAgent,
    })
)(PaymentAgentWithdraw);
