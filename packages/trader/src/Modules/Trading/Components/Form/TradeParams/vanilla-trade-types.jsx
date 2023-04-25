import React from 'react';
import { ButtonToggle } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const VanillaTradeTypes = observer(() => {
    const { ui } = useStore();
    const { onChange } = useTraderStore();
    const { onChangeUiStore, vanilla_trade_type } = ui;

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
});

export default VanillaTradeTypes;
