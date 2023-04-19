import React from 'react';
import classNames from 'classnames';
import { InputWithCheckbox } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const TakeProfit = observer(props => {
    const { ui, client } = useStore();
    const trade = useTraderStore();

    const { addToast, removeToast, current_focus, setCurrentFocus } = ui;
    const { is_single_currency } = client;
    const { is_accumulator, currency } = trade;

    const validation_errors = props.validation_errors ?? trade.validation_errors;
    const take_profit = props.take_profit ?? trade.take_profit;
    const has_take_profit = props.has_take_profit ?? trade.has_take_profit;
    const onChangeMultiple = props.onChangeMultiple ?? trade.onChangeMultiple;
    const onChange = props.onChange ?? trade.onChange;

    const changeValue = e => {
        if (e.target.name === 'has_take_profit') {
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
                classNameInput={classNames('trade-container__input', {
                    'trade-container__input--accumulator': is_accumulator,
                })}
                className={isDesktop() ? 'trade-container__amount trade-container__amount--multipliers' : null}
                currency={currency}
                current_focus={current_focus}
                defaultChecked={has_take_profit}
                error_messages={has_take_profit ? validation_errors.take_profit : undefined}
                is_single_currency={is_single_currency}
                is_negative_disabled={true}
                is_input_hidden={!has_take_profit}
                label={localize('Take profit')}
                name='take_profit'
                onChange={changeValue}
                setCurrentFocus={setCurrentFocus}
                tooltip_label={localize(
                    'Your contract is closed automatically when your profit is more than or equal to this amount.'
                )}
                tooltip_alignment='left'
                error_message_alignment='left'
                value={take_profit}
            />
        </Fieldset>
    );
});

export default TakeProfit;
