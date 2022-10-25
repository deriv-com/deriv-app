import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { InputWithCheckbox } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';

const TakeProfit = ({
    addToast,
    removeToast,
    currency,
    current_focus,
    has_take_profit,
    is_accumulator,
    is_single_currency,
    onChange,
    onChangeMultiple,
    setCurrentFocus,
    take_profit,
    validation_errors,
}) => {
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
};

TakeProfit.propTypes = {
    addToast: PropTypes.func,
    currency: PropTypes.string,
    current_focus: PropTypes.string,
    has_info: PropTypes.bool,
    has_take_profit: PropTypes.bool,
    is_accumulator: PropTypes.bool,
    is_single_currency: PropTypes.bool,
    onChange: PropTypes.func,
    onChangeMultiple: PropTypes.func,
    removeToast: PropTypes.func,
    setCurrentFocus: PropTypes.func,
    take_profit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    validation_errors: PropTypes.object,
};

export default connect(({ modules, client, ui }, props) => ({
    addToast: ui.addToast,
    currency: modules.trade.currency,
    current_focus: ui.current_focus,
    has_take_profit: props.has_take_profit ?? modules.trade.has_take_profit,
    is_accumulator: modules.trade.is_accumulator,
    is_single_currency: client.is_single_currency,
    onChange: props.onChange ?? modules.trade.onChange,
    onChangeMultiple: props.onChangeMultiple ?? modules.trade.onChangeMultiple,
    removeToast: ui.removeToast,
    setCurrentFocus: ui.setCurrentFocus,
    take_profit: props.take_profit ?? modules.trade.take_profit,
    validation_errors: props.validation_errors ?? modules.trade.validation_errors,
}))(TakeProfit);
