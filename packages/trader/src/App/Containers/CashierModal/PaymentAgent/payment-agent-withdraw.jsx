import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import {
    Button,
    Dropdown,
    Form,
    Input }                from 'deriv-components';
import Localize            from 'App/Components/Elements/localize.jsx';
import RadioGroup          from 'App/Components/Form/Radio';
import { localize }        from 'App/i18n';
import { connect }         from 'Stores/connect';
import PaymentAgentReceipt from './payment-agent-receipt.jsx';
import Loading             from '../../../../templates/_common/components/loading.jsx';

const withdrawInitialValues = (selected_payment_agent) => ({
    amount        : '',
    payment_agents: selected_payment_agent,
    payment_method: 'payment_agents',
});

const validateWithdraw = (values) => {
    const errors = {};

    if (values.payment_method === 'payment_agent' && (!values.payment_agent || !/^[A-Za-z]+[0-9]+$/.test(values.payment_agent))) {
        errors.payment_method = true;
    }

    if (!values.amount) {
        errors.amount = true;
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
        const withdrawInitialValuesPassthrough =
            (values) => withdrawInitialValues(values, this.props.selected_payment_agent);

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
                                    initialValues={ withdrawInitialValuesPassthrough }
                                    // validate={ validateWithdraw }
                                    // onSubmit={ onSubmit }
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
                                                                        value={this.props.selected_payment_agent}
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
    currency              : PropTypes.string,
    is_loading            : PropTypes.bool,
    is_name_selected      : PropTypes.bool,
    onChangePaymentAgent  : PropTypes.func,
    onMount               : PropTypes.func,
    payment_agent_list    : PropTypes.array,
    selected_payment_agent: PropTypes.string,
    setIsNameSelected     : PropTypes.func,
};

export default connect(
    ({ client, modules }) => ({
        currency              : client.currency,
        is_name_selected      : modules.cashier.config.payment_agent.is_name_selected,
        is_loading            : modules.cashier.is_loading,
        onChangePaymentAgent  : modules.cashier.onChangePaymentAgent,
        onChangePaymentAgentID: modules.cashier.onChangePaymentAgentID,
        onMount               : modules.cashier.onMountPaymentAgentWithdraw,
        payment_agent_list    : modules.cashier.config.payment_agent.agents,
        selected_payment_agent: modules.cashier.config.payment_agent.selected_agent,
        setIsNameSelected     : modules.cashier.setIsNameSelected,
    })
)(PaymentAgentWithdraw);
