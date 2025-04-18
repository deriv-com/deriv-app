import React from 'react';
import classNames from 'classnames';
import { InputWithCheckbox } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';
import Fieldset from 'App/Components/Form/fieldset';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { TTradeStore } from 'Types';
import DisabledTooltipWrapper from '../disabled-tooltip-wrapper';

type TTakeProfitProps = {
    has_info?: boolean;
    has_take_profit?: boolean;
    onChange?: (e: { target: { name: string; value: unknown } }) => void;
    onChangeMultiple?: (props: Partial<TTradeStore>) => void;
    take_profit?: string;
    validation_errors?: { [key: string]: string[] };
};

const TakeProfit = observer((props: TTakeProfitProps) => {
    const { ui, client } = useStore();
    const trade = useTraderStore();

    const { addToast, removeToast, current_focus, setCurrentFocus } = ui;
    const { is_single_currency } = client;
    const { is_accumulator, currency, has_open_accu_contract } = trade;

    const validation_errors = props.validation_errors ?? trade.validation_errors;
    const take_profit = props.take_profit ?? trade.take_profit;
    const has_take_profit = props.has_take_profit ?? trade.has_take_profit;
    const onChangeMultiple = props.onChangeMultiple ?? trade.onChangeMultiple;
    const onChange = props.onChange ?? trade.onChange;

    const changeValue = (e: Parameters<React.ComponentProps<typeof InputWithCheckbox>['onChange']>[0]) => {
        if (e.target.name === 'has_take_profit') {
            const new_val = e.target.value;
            onChangeMultiple({
                [e.target.name as string]: new_val,
                ...(new_val ? { has_cancellation: false } : {}),
            });
        } else {
            onChange(e);
        }
    };

    const take_profit_tooltip = (
        <Localize i18n_default_text='When your profit reaches or exceeds this amount, your trade will be closed automatically.' />
    );

    return (
        <Fieldset className='trade-container__fieldset'>
            <DisabledTooltipWrapper is_disabled={has_open_accu_contract}>
                <InputWithCheckbox
                    addToast={addToast}
                    removeToast={removeToast}
                    classNameBubble='dc-popover__trade-params'
                    classNameInlinePrefix='trade-container__currency'
                    classNameInput={classNames('trade-container__input', {
                        'trade-container__input--accumulator': is_accumulator,
                    })}
                    className={classNames({
                        'trade-container__amount trade-container__amount--multipliers': isDesktop(),
                    })}
                    currency={currency}
                    current_focus={current_focus ?? ''}
                    defaultChecked={has_take_profit}
                    error_messages={has_take_profit ? validation_errors?.take_profit : undefined}
                    is_disabled={has_open_accu_contract}
                    is_single_currency={is_single_currency}
                    is_negative_disabled
                    is_input_hidden={!has_take_profit}
                    label={localize('Take profit')}
                    name='take_profit'
                    onChange={changeValue}
                    setCurrentFocus={setCurrentFocus}
                    tooltip_label={
                        is_accumulator ? (
                            <React.Fragment>
                                {take_profit_tooltip}{' '}
                                <Localize i18n_default_text="Take profit can't be adjusted after your contract starts." />
                            </React.Fragment>
                        ) : (
                            take_profit_tooltip
                        )
                    }
                    tooltip_alignment='left'
                    error_message_alignment='left'
                    value={take_profit ?? ''}
                />
            </DisabledTooltipWrapper>
        </Fieldset>
    );
});

export default TakeProfit;
