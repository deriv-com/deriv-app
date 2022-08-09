import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'Stores/connect';
import { setTime, toMoment } from '@deriv/shared';
import TimePicker from 'App/Components/Form/TimePicker';
import { getSelectedTime, getBoundaries } from 'Stores/Modules/Trading/Helpers/end-time';

const TradingTimePicker = ({
    expiry_date,
    expiry_time,
    market_close_times,
    market_open_times,
    onChange,
    server_time,
    is_market_closed,
}) => {
    const moment_expiry_date = toMoment(expiry_date);
    const market_open_datetimes = market_open_times.map(open_time => setTime(moment_expiry_date.clone(), open_time));
    const market_close_datetimes = market_close_times.map(close_time =>
        setTime(moment_expiry_date.clone(), close_time)
    );
    const expiry_datetime = setTime(moment_expiry_date.clone(), expiry_time);
    const server_datetime = toMoment(server_time);

    const boundaries = getBoundaries(server_datetime.clone(), market_open_datetimes, market_close_datetimes);
    const selected_time = getSelectedTime(
        server_datetime.clone(),
        expiry_datetime,
        market_open_datetimes,
        market_close_datetimes
    );

    React.useEffect(() => {
        if (expiry_time !== selected_time && !is_market_closed) {
            onChange({
                target: { name: 'expiry_time', value: selected_time },
            });
        }
    }, [expiry_time, selected_time, onChange, is_market_closed]);

    return (
        <TimePicker
            end_times={boundaries.end}
            onChange={onChange}
            name='expiry_time'
            placeholder='12:00'
            start_times={boundaries.start}
            selected_time={selected_time}
        />
    );
};

TradingTimePicker.propTypes = {
    expiry_date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    expiry_time: PropTypes.string,
    is_market_closed: PropTypes.bool,
    market_close_times: PropTypes.array,
    market_open_times: PropTypes.array,
    name: PropTypes.string,
    onChange: PropTypes.func,
    server_time: PropTypes.object,
};

export default connect(({ modules, common }) => ({
    duration_units_list: modules.trade.duration_units_list,
    expiry_time: modules.trade.expiry_time,
    expiry_date: modules.trade.expiry_date,
    market_close_times: modules.trade.market_close_times,
    market_open_times: modules.trade.market_open_times,
    onChange: modules.trade.onChange,
    server_time: common.server_time,
    is_market_closed: modules.trade.is_market_closed,
}))(TradingTimePicker);
