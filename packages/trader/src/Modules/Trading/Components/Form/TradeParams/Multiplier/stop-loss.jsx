import { localize }                   from 'App/i18n';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { connect }                    from 'Stores/connect';
import OrderInput                     from './order-input.jsx';

const StopLoss = ({
    currency,
    is_single_currency,
    onChange,
    stop_loss,
    validation_errors,
})=>{
    return (
        <OrderInput
            amount={stop_loss}
            currency={currency}
            is_single_currency={is_single_currency}
            name={'stop_loss'}
            label={localize('Close when loss is')}
            onChange={onChange}
            validation_errors={validation_errors}
        />
    );
};

StopLoss.propTypes = {
    currency          : PropTypes.string,
    is_single_currency: PropTypes.bool,
    onChange          : PropTypes.func,
    stop_loss         : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    validation_errors : PropTypes.object,
};

export default connect(({ modules, client }) => ({
    currency                : modules.trade.currency,
    is_single_currency      : client.is_single_currency,
    onChange                : modules.trade.onChange,
    stop_loss               : modules.trade.stop_loss,
    validation_errors       : modules.trade.validation_errors,
}))(StopLoss);