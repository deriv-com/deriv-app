import React from 'react';
import { InputWithCheckbox } from '@deriv/components';
import { localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { isDesktop } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const StopLoss = observer(props => {
    const { ui, client } = useStore();
    const trade = useTraderStore();

    const { addToast, removeToast, current_focus, setCurrentFocus } = ui;
    const { is_single_currency } = client;
    const { amount, currency } = trade;

    const validation_errors = props.validation_errors ?? trade.validation_errors;
    const stop_loss = props.stop_loss ?? trade.stop_loss;
    const has_stop_loss = props.has_stop_loss ?? trade.has_stop_loss;
    const onChangeMultiple = props.onChangeMultiple ?? trade.onChangeMultiple;
    const onChange = props.onChange ?? trade.onChange;

    const changeValue = e => {
        if (e.target.name === 'has_stop_loss') {
            const new_val = e.target.value;
            onChangeMultiple({
                [e.target.name]: new_val,
                ...(new_val ? { has_cancellation: false } : {}),
            });
        } else {
            onChange(e);
        }
    };

    return (
        <Fieldset className='trade-container__fieldset'>
            <InputWithCheckbox
                addToast={addToast}
                removeToast={removeToast}
                classNameInlinePrefix='trade-container__currency'
                classNameInput='trade-container__input'
                className={isDesktop() ? 'trade-container__amount trade-container__amount--multipliers' : null}
                currency={currency}
                current_focus={current_focus}
                defaultChecked={has_stop_loss}
                error_messages={has_stop_loss ? validation_errors.stop_loss : undefined}
                is_single_currency={is_single_currency}
                is_negative_disabled={true}
                is_input_hidden={!has_stop_loss}
                label={localize('Stop loss')}
                max_value={+amount}
                name='stop_loss'
                onChange={changeValue}
                setCurrentFocus={setCurrentFocus}
                tooltip_label={localize('Your contract will be closed automatically if your loss reaches this amount.')}
                tooltip_alignment='left'
                error_message_alignment='left'
                value={stop_loss}
            />
        </Fieldset>
    );
});

export default StopLoss;
