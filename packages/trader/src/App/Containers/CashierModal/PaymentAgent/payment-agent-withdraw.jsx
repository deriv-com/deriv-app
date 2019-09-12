import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import {
    Button,
    Dropdown,
    Input }                 from 'deriv-components';
import {
    Field,
    Formik,
    Form }                  from 'formik';
import { getDecimalPlaces } from '_common/base/currency_base';
import Localize             from 'App/Components/Elements/localize.jsx';
// import RadioGroup           from 'App/Components/Form/Radio';
import { localize }         from 'App/i18n';
import Icon                 from 'Assets/icon.jsx';
import { connect }          from 'Stores/connect';
import {
    validNumber,
    getPreBuildDVRs }       from 'Utils/Validator/declarative-validation-rules';
import PaymentAgentReceipt  from './payment-agent-receipt.jsx';
import Error                from '../error.jsx';
import Loading              from '../../../../templates/_common/components/loading.jsx';

const validateWithdrawal = (values, { balance, currency, payment_agent }) => {
    const errors = {};

    // TODO: uncomment this when adding the input field in the form
    // if (values.payment_method === 'payment_agent' && (!values.payment_agent || !/^[A-Za-z]+[0-9]+$/.test(values.payment_agent))) {
    //     errors.payment_method = true;
    // }

    if (!values.amount) {
        errors.amount = localize('This field is required.');
    } else if (!validNumber(values.amount, { type: 'float', decimals: getDecimalPlaces(currency), min: payment_agent.min_withdrawal, max: payment_agent.max_withdrawal })) {
        errors.amount = getPreBuildDVRs().number.message;
    } else if (+balance < +values.amount) {
        errors.amount = localize('Insufficient balance.');
    }

    return errors;
};

class PaymentAgentWithdraw extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    validateWithdrawalPassthrough = (values) => (
        validateWithdrawal(values, {
            balance      : this.props.balance,
            currency     : this.props.currency,
            payment_agent: this.props.selected_payment_agent,
        })
    );

    onWithdrawalPassthrough = (values) => {
        this.props.requestPaymentAgentWithdraw({
            loginid          : this.props.selected_payment_agent.value,
            currency         : this.props.currency,
            amount           : values.amount,
            verification_code: this.props.verification_code,
        });
    };

    render() {
        return (
            <React.Fragment>
                {this.props.is_loading ?
                    <Loading className='cashier__loader' />
                    :
                    <React.Fragment>
                        {/* for errors with CTA hide the form and show the error,
                         for others show them at the bottom of the form next to submit button */}
                        {this.props.error.button_text ?
                            <Error error={this.props.error} />
                            :
                            <div className='cashier__wrapper--align-left'>
                                {this.props.is_withdraw_successful ?
                                    <PaymentAgentReceipt />
                                    :
                                    <React.Fragment>
                                        <h2 className='payment-agent__header'>
                                            <Localize i18n_default_text='Payment agent withdrawal' />
                                        </h2>
                                        <Formik
                                            initialValues={{
                                                amount        : '',
                                                payment_agents: this.props.selected_payment_agent.value,
                                                payment_method: 'payment_agents',
                                            }}
                                            validate={this.validateWithdrawalPassthrough}
                                            onSubmit={this.onWithdrawalPassthrough}
                                        >
                                            {
                                                ({ errors, isSubmitting, isValid, touched, values }) => (
                                                    <Form>
                                                        <Dropdown
                                                            id='payment_agents'
                                                            className='payment-agent__drop-down'
                                                            classNameDisplay='payment-agent__drop-down-display'
                                                            classNameDisplaySpan='payment-agent__drop-down-display-span'
                                                            classNameItems='payment-agent__drop-down-items'
                                                            list={this.props.payment_agent_list}
                                                            name='payment_agents'
                                                            value={this.props.selected_payment_agent.value}
                                                            onChange={this.props.onChangePaymentAgent}
                                                        />
                                                        {/* TODO: uncomment these when radio group can be in form */}
                                                        {/* eslint-disable max-len */}
                                                        {/* <RadioGroup */}
                                                        {/*    className='payment-agent__radio-group' */}
                                                        {/*    items={[ */}
                                                        {/*        { */}
                                                        {/*            className: 'payment-agent__radio', */}
                                                        {/*            label    : ( */}
                                                        {/*                <React.Fragment> */}
                                                        {/*                    <Localize i18n_default_text='By name' /> */}
                                                        {/*                    <Dropdown */}
                                                        {/*                        id='payment_agents' */}
                                                        {/*                        className='payment-agent__drop-down' */}
                                                        {/*                        classNameDisplay='payment-agent__drop-down-display' */}
                                                        {/*                        classNameDisplaySpan='payment-agent__drop-down-display-span' */}
                                                        {/*                        classNameItems='payment-agent__drop-down-items' */}
                                                        {/*                        list={this.props.payment_agent_list} */}
                                                        {/*                        name='payment_agents' */}
                                                        {/*                        value={this.props.selected_payment_agent.value} */}
                                                        {/*                        onChange={this.props.onChangePaymentAgent} */}
                                                        {/*                    /> */}
                                                        {/*                </React.Fragment> */}
                                                        {/*            ), */}
                                                        {/*            value: true, */}
                                                        {/*        }, */}
                                                        {/*        { */}
                                                        {/*            className: 'payment-agent__radio', */}
                                                        {/*            label    : ( */}
                                                        {/*                <React.Fragment> */}
                                                        {/*                    <Localize i18n_default_text='By payment agent ID' /> */}
                                                        {/*                    <Input */}
                                                        {/*                        autoComplete='off' */}
                                                        {/*                        maxLength='20' */}
                                                        {/*                        className='payment-agent__input' */}
                                                        {/*                        type='text' */}
                                                        {/*                        name='payment_agent' */}
                                                        {/*                        placeholder='CR' */}
                                                        {/*                    /> */}
                                                        {/*                </React.Fragment> */}
                                                        {/*            ), */}
                                                        {/*            value: false, */}
                                                        {/*        }, */}
                                                        {/*    ]} */}
                                                        {/*    name='payment_method' */}
                                                        {/*    selected={this.props.is_name_selected} */}
                                                        {/*    onToggle={this.props.setIsNameSelected} */}
                                                        {/* /> */}
                                                        {/* eslint-enable max-len */}
                                                        <Field name='amount'>
                                                            {({ field }) => (
                                                                <Input
                                                                    { ...field }
                                                                    className='cashier__input-long dc-input--no-placeholder'
                                                                    type='number'
                                                                    label={localize('Amount')}
                                                                    error={ touched.amount && errors.amount }
                                                                    required
                                                                    leading_icon={<span className={classNames('symbols', `symbols--${this.props.currency.toLowerCase()}`)} />}
                                                                    autoComplete='off'
                                                                    maxLength='30'
                                                                />
                                                            )}
                                                        </Field>
                                                        <div className='cashier__form-submit'>
                                                            {this.props.error.message &&
                                                            <React.Fragment>
                                                                <Icon icon='IconEmergency' className='cashier__form-error-icon' />
                                                                <Icon icon='IconError' className='cashier__form-error-small-icon' />
                                                                <p className='cashier__form-error'>
                                                                    {this.props.error.message}
                                                                </p>
                                                            </React.Fragment>
                                                            }
                                                            <Button
                                                                className='cashier__form-submit-button btn--primary btn--primary--orange'
                                                                type='submit'
                                                                is_disabled={
                                                                    !values.payment_method || !isValid || isSubmitting
                                                                }
                                                            >
                                                                <Localize i18n_default_text='Withdraw' />
                                                            </Button>
                                                        </div>
                                                    </Form>
                                                )
                                            }
                                        </Formik>
                                    </React.Fragment>
                                }
                            </div>
                        }
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

PaymentAgentWithdraw.propTypes = {
    balance                    : PropTypes.string,
    currency                   : PropTypes.string,
    error_message_withdraw     : PropTypes.string,
    is_loading                 : PropTypes.bool,
    is_name_selected           : PropTypes.bool,
    is_withdraw_successful     : PropTypes.bool,
    onChangePaymentAgent       : PropTypes.func,
    onMount                    : PropTypes.func,
    payment_agent_list         : PropTypes.array,
    requestPaymentAgentWithdraw: PropTypes.func,
    selected_payment_agent     : PropTypes.object,
    setIsNameSelected          : PropTypes.func,
    verification_code          : PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        balance                    : client.balance,
        currency                   : client.currency,
        error                      : modules.cashier.config.payment_agent.error,
        is_name_selected           : modules.cashier.config.payment_agent.is_name_selected,
        is_loading                 : modules.cashier.is_loading,
        is_withdraw_successful     : modules.cashier.config.payment_agent.is_withdraw_successful,
        onChangePaymentAgent       : modules.cashier.onChangePaymentAgent,
        onChangePaymentAgentID     : modules.cashier.onChangePaymentAgentID,
        onMount                    : modules.cashier.onMountPaymentAgentWithdraw,
        payment_agent_list         : modules.cashier.config.payment_agent.agents,
        requestPaymentAgentWithdraw: modules.cashier.requestPaymentAgentWithdraw,
        selected_payment_agent     : modules.cashier.config.payment_agent.selected_agent,
        setIsNameSelected          : modules.cashier.setIsNameSelected,
    })
)(PaymentAgentWithdraw);
