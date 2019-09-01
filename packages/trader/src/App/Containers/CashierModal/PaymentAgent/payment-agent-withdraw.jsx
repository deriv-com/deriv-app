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
import { connect }         from 'Stores/connect';
import PaymentAgentReceipt from './payment-agent-receipt.jsx';
import Loading             from '../../../../templates/_common/components/loading.jsx';

class PaymentAgentWithdraw extends React.Component {
    state = {
        is_submitting: false,
    };

    componentDidMount() {
        this.props.onMount();
    }

    render() {
        return (
            <React.Fragment>
                {this.props.is_loading ?
                    <Loading className='payment-agent__loader' />
                    :
                    <div className='payment-agent__wrapper'>
                        {this.state.is_submitting ?
                            <PaymentAgentReceipt />
                            :
                            <React.Fragment>
                                <h2 className='payment-agent__header'><Localize i18n_default_text='Payment agent withdrawal' /></h2>
                                <Form
                                    initialValues={{
                                        amount        : '',
                                        payment_agents: this.props.selected_payment_agent,
                                    }}
                                    // validate={ validate }
                                    // onSubmit={ onSubmit }
                                >
                                    {
                                        ({ isSubmitting, isValid, values }) => (
                                            <React.Fragment>
                                                <RadioGroup
                                                    className='payment-agent__radio'
                                                    items={[
                                                        {
                                                            label: (
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
                                                            label: (
                                                                <React.Fragment>
                                                                    <Localize i18n_default_text='By payment agent ID' />
                                                                    {/* TODO: after radio-group refactor */}
                                                                    {/* <Input */}
                                                                    {/*    className='payment-agent__input' */}
                                                                    {/*    type='text' */}
                                                                    {/*    name='payment_agent' */}
                                                                    {/* /> */}
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
                                                    className='payment-agent__input'
                                                    type='text'
                                                    name='amount'
                                                />
                                                <Button
                                                    className={classNames('payment-agent__withdraw-button', { 'payment-agent__withdraw-button--disabled': !values.payment_method || !isValid || isSubmitting })}
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
    is_loading            : PropTypes.bool,
    is_name_selected      : PropTypes.bool,
    onChangePaymentAgent  : PropTypes.func,
    onMount               : PropTypes.func,
    payment_agent_list    : PropTypes.array,
    selected_payment_agent: PropTypes.string,
    setIsNameSelected     : PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        is_name_selected      : modules.cashier.config.payment_agent.is_name_selected,
        is_loading            : modules.cashier.is_loading,
        onChangePaymentAgent  : modules.cashier.onChangePaymentAgent,
        onMount               : modules.cashier.onMountPaymentAgentWithdraw,
        payment_agent_list    : modules.cashier.config.payment_agent.agents,
        selected_payment_agent: modules.cashier.config.payment_agent.selected_agent,
        setIsNameSelected     : modules.cashier.setIsNameSelected,
    })
)(PaymentAgentWithdraw);
