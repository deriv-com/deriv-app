import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import InputWithCheckbox from 'App/Components/Form/InputField/input-with-checkbox.jsx';
import { connect } from 'Stores/connect';
import PopoverMessageCheckbox from 'Modules/Trading/Components/Elements/popover-message-checkbox.jsx';

const TakeProfit = ({
    currency,
    has_take_profit,
    is_single_currency,
    onChange,
    should_show_take_profit_warning,
    take_profit,
    toggleTakeProfitWarning,
    validation_errors,
}) => {
    const checkbox_tooltip_label = (
        <PopoverMessageCheckbox
            defaultChecked={!should_show_take_profit_warning}
            message={localize(
                'If you purchase a contract with take profit and deal cancellation, you may update your take profit amount only after deal cancellation has expired.'
            )}
            name='should_show_take_profit_warning'
            onChange={() => toggleTakeProfitWarning()}
        />
    );

    return (
        <Fieldset className='trade-container__fieldset'>
            <InputWithCheckbox
                className='trade-container__amount'
                classNameInlinePrefix='trade-container__currency'
                classNameInput='trade-container__input'
                currency={currency}
                defaultChecked={has_take_profit}
                error_messages={has_take_profit ? validation_errors.take_profit : undefined}
                is_single_currency={is_single_currency}
                is_negative_disabled={true}
                label={localize('Take profit')}
                name='take_profit'
                onChange={onChange}
                checkbox_tooltip_label={should_show_take_profit_warning ? checkbox_tooltip_label : undefined}
                tooltip_label={localize(
                    'Your contract is closed automatically when your profit is more than or equals to this amount.'
                )}
                value={take_profit}
            />
        </Fieldset>
    );
};

TakeProfit.propTypes = {
    currency: PropTypes.string,
    has_take_profit: PropTypes.bool,
    is_single_currency: PropTypes.bool,
    onChange: PropTypes.func,
    take_profit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    validation_errors: PropTypes.object,
};

export default connect(({ modules, client, ui }) => ({
    is_single_currency: client.is_single_currency,
    currency: modules.trade.currency,
    has_take_profit: modules.trade.has_take_profit,
    onChange: modules.trade.onChange,
    take_profit: modules.trade.take_profit,
    validation_errors: modules.trade.validation_errors,
    should_show_take_profit_warning: ui.should_show_take_profit_warning,
    toggleTakeProfitWarning: ui.toggleTakeProfitWarning,
}))(TakeProfit);
