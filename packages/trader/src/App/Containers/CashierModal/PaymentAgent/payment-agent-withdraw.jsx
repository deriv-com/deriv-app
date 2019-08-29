import PropTypes   from 'prop-types';
import React       from 'react';
import Localize    from 'App/Components/Elements/localize.jsx';
import RadioGroup  from 'App/Components/Form/Radio';
import { connect } from 'Stores/connect';

class PaymentAgentWithdraw extends React.Component {
    render() {
        return (
            <div className='payment-agent__wrapper'>
                <h2 className='payment-agent__header'><Localize i18n_default_text='Payment agent withdrawal' /></h2>
                <RadioGroup
                    items={[
                        {
                            label: <Localize i18n_default_text='By name' />,
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
    is_name_selected : PropTypes.bool,
    setIsNameSelected: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        is_name_selected : modules.cashier.config.payment_agent.is_name_selected,
        setIsNameSelected: modules.cashier.setIsNameSelected,
        verification_code: client.verification_code,
    })
)(PaymentAgentWithdraw);
