import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { Dropdown }                   from 'deriv-components';
import Localize                       from 'App/Components/Elements/localize.jsx';
import RadioGroup                     from 'App/Components/Form/Radio';
import { connect }                    from 'Stores/connect';

class PaymentAgentWithdraw extends React.Component {
    render() {
        return (
            <div className='payment-agent__wrapper'>
                <h2 className='payment-agent__header'><Localize i18n_default_text='Payment agent withdrawal' /></h2>
                <RadioGroup
                    className='payment-agent__radio'
                    items={[
                        {
                            label: (
                                <React.Fragment>
                                    <Localize i18n_default_text='By name' />
                                    <Dropdown
                                        id='payment_methods'
                                        className='payment-agent__drop-down'
                                        list={this.props.supported_banks}
                                        name='payment_methods'
                                        value=''
                                        onChange={this.props.onChangePaymentMethod}
                                    />
                                </React.Fragment>
                            ),
                            value: true,
                        },
                        {
                            label: <Localize i18n_default_text='By payment agent ID' />,
                            value: false,
                        },
                    ]}
                    selected={this.props.is_name_selected}
                    onToggle={this.props.setIsNameSelected}
                />
            </div>
        );
    }
}

PaymentAgentWithdraw.propTypes = {
    is_name_selected     : PropTypes.bool,
    onChangePaymentMethod: PropTypes.func,
    setIsNameSelected    : PropTypes.func,
    supported_banks      : MobxPropTypes.arrayOrObservableArray,
    verification_code    : PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        is_name_selected : modules.cashier.config.payment_agent.is_name_selected,
        setIsNameSelected: modules.cashier.setIsNameSelected,
        verification_code: client.verification_code,
    })
)(PaymentAgentWithdraw);
