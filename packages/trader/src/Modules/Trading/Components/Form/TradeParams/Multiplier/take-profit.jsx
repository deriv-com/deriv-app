import { localize }                   from 'App/i18n';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { connect }                    from 'Stores/connect';
import OrderInput                     from './order-input.jsx';

const TakeProfit = ({
    currency,
    is_single_currency,
    onChange,
    validation_errors,
    take_profit,
})=>{
    return (
        <OrderInput
            amount={take_profit}
            currency={currency}
            is_single_currency={is_single_currency}
            name={'take_profit'}
            label={localize('Close when profit is')}
            onChange={onChange}
            validation_errors={validation_errors}
        />
    );
};

TakeProfit.propTypes = {
    currency           : PropTypes.string,
    is_single_currency : PropTypes.bool,
    onChange           : PropTypes.func,
    validation_errors  : PropTypes.object,
    take_profit        : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default connect(({ modules, client }) => ({
    currency                : modules.trade.currency,
    is_single_currency      : client.is_single_currency,
    onChange                : modules.trade.onChange,
    validation_errors       : modules.trade.validation_errors,
    take_profit             : modules.trade.take_profit,
}))(TakeProfit);