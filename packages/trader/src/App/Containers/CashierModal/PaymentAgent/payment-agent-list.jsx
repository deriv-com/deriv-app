import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { Scrollbars }                 from 'tt-react-custom-scrollbars';
import {
    Accordion,
    Button }                          from 'deriv-components';
import Localize                       from 'App/Components/Elements/localize.jsx';
import Dropdown                       from 'App/Components/Form/DropDown';
import { localize }                   from 'App/i18n';
import { connect }                    from 'Stores/connect';
import Icon                           from 'Assets/icon.jsx';
import Loading                        from '../../../../templates/_common/components/loading.jsx';

class PaymentAgentList extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    render() {
        return (
            <React.Fragment>
                {this.props.is_loading ?
                    <Loading />
                    :
                    <React.Fragment>
                        <div className='payment-agent__wrapper'>
                            <Scrollbars
                                style={{ width: '100%', height: '100%' }}
                                autoHide
                            >
                                <p className='payment-agent__description'><Localize i18n_default_text='A payment agent is authorised to process deposits and withdrawals for you if your local payment methods or currencies are not supported on Deriv.' /></p>
                                <div className='payment-agent__instructions'>
                                    <div className='payment-agent__instructions-section'>
                                        <h2 className='payment-agent__header'><Localize i18n_default_text='Deposit' /></h2>
                                        <p className='payment-agent__description'><Localize i18n_default_text='Choose a payment agent and contact them for instructions.' /></p>
                                    </div>
                                    <div className='payment-agent__instructions-section'>
                                        <h2 className='payment-agent__header'><Localize i18n_default_text='Withdrawal' /></h2>
                                        <Button
                                            className='btn--primary btn--primary--orange payment-agent__button'
                                            has_effect
                                            text={localize('Request withdrawal form')}
                                            onClick={this.handleConfirm}
                                        />
                                    </div>
                                </div>
                                <h2 className='payment-agent__header'><Localize i18n_default_text='Available Payment Agents' /></h2>
                                <div className='payment-agent__description'>
                                    <Localize i18n_default_text='Deposit/withdrawal method' />
                                    <Dropdown
                                        id='payment_methods'
                                        className='payment-agent__drop-down'
                                        list={
                                            this.props.available_payment_methods.map((payment_method) =>
                                                ({ text: payment_method, value: payment_method.toLowerCase() }))
                                        }
                                        name='payment_methods'
                                        value='any'
                                        onChange={this.props.onChangePaymentMethod}
                                    />
                                </div>
                                <Accordion
                                    className='payment-agent__accordion'
                                    list={this.props.payment_agent_list.map((payment_agent) => ({
                                        header : payment_agent.name,
                                        content: (
                                            <div className='payment-agent__accordion-content'>
                                                <div><Icon icon='IconPhone' className='payment-agent__accordion-content-icon' />{payment_agent.phone}</div>
                                                <div><Icon icon='IconWebsite' className='payment-agent__accordion-content-icon' />{payment_agent.url}</div>
                                                <div><Icon icon='IconEmail' className='payment-agent__accordion-content-icon' />{payment_agent.email}</div>
                                            </div>
                                        ),
                                    }))}
                                />
                            </Scrollbars>
                        </div>
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

PaymentAgentList.propTypes = {
    available_payment_methods: MobxPropTypes.arrayOrObservableArray,
    is_loading               : PropTypes.bool,
    onChangePaymentMethod    : PropTypes.func,
    onMount                  : PropTypes.func,
    payment_agent_list       : PropTypes.array,
};

export default connect(
    ({ modules }) => ({
        available_payment_methods: modules.cashier.config.payment_agent.available_payment_methods,
        is_loading               : modules.cashier.is_loading,
        onChangePaymentMethod    : modules.cashier.onChangePaymentMethod,
        onMount                  : modules.cashier.onMountPaymentAgent,
        payment_agent_list       : modules.cashier.config.payment_agent.list,
    })
)(PaymentAgentList);
