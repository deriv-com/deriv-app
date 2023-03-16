import React from 'react';
import { ButtonToggle } from '@deriv/components';
import { connect } from 'Stores/connect';
import Fieldset from 'App/Components/Form/fieldset.jsx';

const VanillaTradeTypes = ({ onChange, onChangeUiStore, vanilla_trade_type }) => {
    const changeTradeType = ({ target }) => {
        const { name, value } = target;

        onChange({ target: { name, value } });
        onChangeUiStore({ name, value });
    };

    return (
        <Fieldset className='trade-container__fieldset'>
            <ButtonToggle
                buttons_arr={[
                    { text: 'Call', value: 'VANILLALONGCALL' },
                    { text: 'Put', value: 'VANILLALONGPUT' },
                ]}
                id='dt_vanilla_trade_types_toggle'
                is_animated={true}
                name='vanilla_trade_type'
                onChange={changeTradeType}
                value={vanilla_trade_type}
            />
        </Fieldset>
    );
};

export default connect(({ modules, ui }) => ({
    onChange: modules.trade.onChange,
    onChangeUiStore: ui.onChangeUiStore,
    vanilla_trade_type: ui.vanilla_trade_type,
}))(VanillaTradeTypes);
