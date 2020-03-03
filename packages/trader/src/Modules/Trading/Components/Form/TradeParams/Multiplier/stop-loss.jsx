import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import InputWithCheckbox from 'App/Components/Form/InputField/input-with-checkbox.jsx';
import { connect } from 'Stores/connect';
import PopoverMessageCheckbox from 'Modules/Trading/Components/Elements/popover-message-checkbox.jsx';

const StopLoss = ({
    amount,
    currency,
    has_cancellation,
    has_stop_loss,
    is_single_currency,
    should_show_stop_loss_warning,
    onChange,
    onChangeMultiple,
    stop_loss,
    toggleStopLossWarning,
    validation_errors,
}) => {
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

    const should_show_popover = has_cancellation && should_show_stop_loss_warning;

    const checkbox_tooltip_label = (
        <PopoverMessageCheckbox
            defaultChecked={!should_show_stop_loss_warning}
            message={localize(
                'You may choose either stop loss or deal cancellation. You may set a stop loss amount after deal cancellation has expired.'
            )}
            name='should_show_stop_loss_warning'
            onChange={() => toggleStopLossWarning()}
        />
    );

    return (
        <Fieldset className='trade-container__fieldset'>
            <InputWithCheckbox
                className='trade-container__amount'
                classNameInlinePrefix='trade-container__currency'
                classNameInput='trade-container__input'
                currency={currency}
                defaultChecked={has_stop_loss}
                error_messages={has_stop_loss ? validation_errors.stop_loss : undefined}
                is_single_currency={is_single_currency}
                is_negative_disabled={true}
                label={localize('Stop loss')}
                max_value={+amount}
                name='stop_loss'
                onChange={changeValue}
                checkbox_tooltip_label={should_show_popover ? checkbox_tooltip_label : undefined}
                tooltip_label={localize(
                    'Your contract is closed automatically when your loss is more than or equals to this amount.'
                )}
                value={stop_loss}
            />
        </Fieldset>
    );
};

StopLoss.propTypes = {
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    currency: PropTypes.string,
    has_stop_loss: PropTypes.bool,
    is_single_currency: PropTypes.bool,
    onChange: PropTypes.func,
    onChangeMultiple: PropTypes.func,
    should_show_stop_loss_warning: PropTypes.bool,
    stop_loss: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    toggleStopLossWarning: PropTypes.func,
    validation_errors: PropTypes.object,
};

export default connect(({ modules, client, ui }) => ({
    is_single_currency: client.is_single_currency,
    amount: modules.trade.amount,
    currency: modules.trade.currency,
    has_cancellation: modules.trade.has_cancellation,
    has_stop_loss: modules.trade.has_stop_loss,
    onChange: modules.trade.onChange,
    onChangeMultiple: modules.trade.onChangeMultiple,
    stop_loss: modules.trade.stop_loss,
    validation_errors: modules.trade.validation_errors,
    should_show_stop_loss_warning: ui.should_show_stop_loss_warning,
    toggleStopLossWarning: ui.toggleStopLossWarning,
}))(StopLoss);
