import PropTypes from 'prop-types';
import React from 'react';
import { InputWithCheckbox } from '@deriv/components';
import { localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';
import { isDesktop } from '@deriv/shared';

const StopLoss = ({
    addToast,
    removeToast,
    amount,
    currency,
    current_focus,
    has_stop_loss,
    is_single_currency,
    onChange,
    onChangeMultiple,
    setCurrentFocus,
    stop_loss,
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
                tooltip_label={localize(
                    'Your contract is closed automatically when your loss is more than or equals to this amount.'
                )}
                tooltip_alignment='left'
                error_message_alignment='left'
                value={stop_loss}
            />
        </Fieldset>
    );
};

StopLoss.propTypes = {
    addToast: PropTypes.func,
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    currency: PropTypes.string,
    current_focus: PropTypes.string,
    has_stop_loss: PropTypes.bool,
    is_single_currency: PropTypes.bool,
    onChange: PropTypes.func,
    onChangeMultiple: PropTypes.func,
    removeToast: PropTypes.func,
    setCurrentFocus: PropTypes.func,
    stop_loss: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    validation_errors: PropTypes.object,
};

export default connect(({ modules, client, ui }, props) => ({
    addToast: ui.addToast,
    amount: modules.trade.amount,
    currency: modules.trade.currency,
    current_focus: ui.current_focus,
    has_cancellation: props.has_cancellation ?? modules.trade.has_cancellation,
    has_stop_loss: props.has_stop_loss ?? modules.trade.has_stop_loss,
    is_single_currency: client.is_single_currency,
    onChange: props.onChange ?? modules.trade.onChange,
    onChangeMultiple: props.onChangeMultiple ?? modules.trade.onChangeMultiple,
    setCurrentFocus: ui.setCurrentFocus,
    removeToast: ui.removeToast,
    stop_loss: props.stop_loss ?? modules.trade.stop_loss,
    validation_errors: props.validation_errors ?? modules.trade.validation_errors,
}))(StopLoss);
