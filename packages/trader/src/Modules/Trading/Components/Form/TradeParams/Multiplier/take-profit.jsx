import PropTypes       from 'prop-types';
import React           from 'react';
import { localize }    from 'App/i18n';
import { connect }     from 'Stores/connect';
import LimitOrderInput from './limit-order-input.jsx';

const TakeProfit = ({
    currency,
    has_take_profit,
    is_single_currency,
    onChange,
    take_profit,
    validation_errors,
}) => {
    return (
        <LimitOrderInput
            currency={currency}
            error_messages={has_take_profit ? validation_errors.take_profit : undefined}
            is_single_currency={is_single_currency}
            label={localize('Take profit')}
            name='take_profit'
            onChange={onChange}
            tooltip_label={localize('Close the deal when my loss reaches this amount.')}
            value={take_profit}
        />
    );
};

TakeProfit.propTypes = {
    currency          : PropTypes.string,
    has_take_profit   : PropTypes.bool,
    is_single_currency: PropTypes.bool,
    onChange          : PropTypes.func,
    take_profit       : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    validation_errors: PropTypes.object,
};

export default connect(({ modules, client }) => ({
    is_single_currency: client.is_single_currency,
    currency          : modules.trade.currency,
    has_take_profit   : modules.trade.has_take_profit,
    onChange          : modules.trade.onChange,
    take_profit       : modules.trade.take_profit,
    validation_errors : modules.trade.validation_errors,
}))(TakeProfit);
