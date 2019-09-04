import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import {
    Button,
    Dropdown,
    Form,
    Input }                 from 'deriv-components';
import { getDecimalPlaces } from '_common/base/currency_base';
import Localize             from 'App/Components/Elements/localize.jsx';
import RadioGroup           from 'App/Components/Form/Radio';
import { localize }         from 'App/i18n';
import { connect }          from 'Stores/connect';
import {
    validNumber,
    getPreBuildDVRs }       from 'Utils/Validator/declarative-validation-rules';
import PaymentAgentReceipt  from './payment-agent-receipt.jsx';
import Loading              from '../../../../templates/_common/components/loading.jsx';

const validateWithdrawal = (values, { balance, currency, payment_agent }) => {
    const errors = {};

    if (values.payment_method === 'payment_agent' && (!values.payment_agent || !/^[A-Za-z]+[0-9]+$/.test(values.payment_agent))) {
        errors.payment_method = true;
    }

    if (!values.amount) {
        errors.amount = true;
    } else if (!validNumber(values.amount, { type: 'float', decimals: getDecimalPlaces(currency), min: payment_agent.min_withdrawal, max: payment_agent.max_withdrawal })) {
        errors.amount = getPreBuildDVRs().number.message;
    } else if (+balance < +values.amount) {
        errors.amount = localize('Insufficient balance.');
    }

    return errors;
};

class PaymentAgentWithdraw extends React.Component {
    state = {
        is_submitted: false,
    };

    componentDidMount() {
        this.props.onMount();
    }

    render() {
        const validateWithdrawalPassthrough = (values) =>
            validateWithdrawal(values, {
                balance      : this.props.balance,
                currency     : this.props.currency,
                payment_agent: this.props.selected_payment_agent,
            });

        const onWithdrawalPassthrough = (values) => {
            this.props.requestPaymentAgentWithdraw({
                loginid          : values.payment_agents || values.payment_agent,
                currency         : this.props.currency,
                amount           : values.amount,
                verification_code: this.props.verification_code,
            });
        };

        return (
            <React.Fragment>
                {this.props.is_loading ?
                    <Loading className='payment-agent__loader' />
                    :
                    <div className='payment-agent__wrapper'>
                        {this.state.is_submitted ?
                            <PaymentAgentReceipt />
                            :
                            <React.Fragment>
                                <h2 className='payment-agent__header'><Localize i18n_default_text='Payment agent withdrawal' /></h2>
                                <Form
                                    initialValues={{
                                        amount        : '',
                                        payment_agents: this.props.selected_payment_agent.name,
                                        payment_method: 'payment_agents',
                                    }}
                                    validate={ validateWithdrawalPassthrough }
                                    onSubmit={ onWithdrawalPassthrough }
                                >
                                    {
                                        ({ isSubmitting, isValid, values }) => (
                                            <React.Fragment>
                                                <RadioGroup
                                                    className='payment-agent__radio-group'
                                                    items={[
                                                        {
                                                            className: 'payment-agent__radio',
                                                            label    : (
                                                                <React.Fragment>
                                                                    <Localize i18n_default_text='By name' />
                                                                    <Dropdown
                                                                        id='payment_agents'
                                                                        className='payment-agent__drop-down'
                                                                        classNameDisplay='payment-agent__drop-down-display'
                                                                        classNameDisplaySpan='payment-agent__drop-down-display-span'
                                                                        classNameItems='payment-agent__drop-down-items'
                                                                        list={this.props.payment_agent_list}
                                                                        name='payment_agents'
                                                                        value={this.props.selected_payment_agent.name}
                                                                        onChange={this.props.onChangePaymentAgent}
                                                                    />
                                                                </React.Fragment>
                                                            ),
                                                            value: true,
                                                        },
                                                        {
                                                            className: 'payment-agent__radio',
                                                            label    : (
                                                                <React.Fragment>
                                                                    <Localize i18n_default_text='By payment agent ID' />
                                                                    <Input
                                                                        autoComplete='off'
                                                                        maxLength='20'
                                                                        className='payment-agent__input'
                                                                        type='text'
                                                                        name='payment_agent'
                                                                        placeholder='CR'
                                                                    />
                                                                </React.Fragment>
                                                            ),
                                                            value: false,
                                                        },
                                                    ]}
                                                    name='payment_method'
                                                    selected={this.props.is_name_selected}
                                                    onToggle={this.props.setIsNameSelected}
                                                />
                                                <Input
                                                    className='payment-agent__input-long'
                                                    type='number'
                                                    maxLength='30'
                                                    name='amount'
                                                    label={localize('Amount')}
                                                    leading_icon={
                                                        <span
                                                            className={classNames('symbols', `symbols--${this.props.currency.toLowerCase()}`)}
                                                        />
                                                    }
                                                />
                                                <Button
                                                    className={
                                                        classNames(
                                                            'payment-agent__withdraw-button',
                                                            'btn--primary',
                                                            'btn--primary--orange',
                                                            { 'payment-agent__withdraw-button--disabled': !values.payment_method || !isValid || isSubmitting },
                                                        )
                                                    }
                                                    type='submit'
                                                    is_disabled={ !values.payment_method || !isValid || isSubmitting }
                                                >
                                                    <Localize i18n_default_text='Withdraw' />
                                                </Button>
                                            </React.Fragment>
                                        )
                                    }
                                </Form>
                            </React.Fragment>
                        }
                    </div>
                }
            </React.Fragment>
        );
    }
}

PaymentAgentWithdraw.propTypes = {
    balance                    : PropTypes.string,
    currency                   : PropTypes.string,
    is_loading                 : PropTypes.bool,
    is_name_selected           : PropTypes.bool,
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
        is_name_selected           : modules.cashier.config.payment_agent.is_name_selected,
        is_loading                 : modules.cashier.is_loading,
        onChangePaymentAgent       : modules.cashier.onChangePaymentAgent,
        onChangePaymentAgentID     : modules.cashier.onChangePaymentAgentID,
        onMount                    : modules.cashier.onMountPaymentAgentWithdraw,
        payment_agent_list         : modules.cashier.config.payment_agent.agents,
        requestPaymentAgentWithdraw: modules.cashier.requestPaymentAgentWithdraw,
        selected_payment_agent     : modules.cashier.config.payment_agent.selected_agent,
        setIsNameSelected          : modules.cashier.setIsNameSelected,
    })
)(PaymentAgentWithdraw);
