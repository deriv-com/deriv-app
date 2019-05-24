import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from 'Stores/connect';
import {
    setTime,
    toMoment }     from 'Utils/Date';
import TimePicker  from 'App/Components/Form/TimePicker';
import {
    getSelectedTime,
    getBoundaries } from 'Stores/Modules/Trading/Helpers/end-time';

const TradingTimePicker = ({
    expiry_date,
    expiry_time,
    market_close_times,
    market_open_times,
    onChange,
    server_time,
}) => {
    const moment_expiry_date = toMoment(expiry_date);
    const market_open_datetime = setTime(moment_expiry_date.clone(), market_open_times.slice(-1)[0]);
    const market_close_datetime = setTime(moment_expiry_date.clone(), market_close_times.slice(-1)[0]);
    const expiry_datetime = setTime(moment_expiry_date.clone(), expiry_time);
    const server_datetime = toMoment(server_time);

    const boundaries = getBoundaries(
        server_datetime.clone(),
        market_open_datetime.clone(),
        market_close_datetime);
    const selected_time = getSelectedTime(
        server_datetime.clone(),
        expiry_datetime,
        market_open_datetime);
    return (
        <TimePicker
            end_time={boundaries.end}
            onChange={onChange}
            name='expiry_time'
            placeholder='12:00'
            start_time={boundaries.start}
            selected_time={selected_time}
        />
    );
};

TradingTimePicker.propTypes = {
    expiry_date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    expiry_time       : PropTypes.string,
    market_close_times: PropTypes.array,
    name              : PropTypes.string,
    onChange          : PropTypes.func,
    server_time       : PropTypes.object,
};

export default connect(
    ({ modules, common }) => ({
        duration_units_list: modules.trade.duration_units_list,
        expiry_time        : modules.trade.expiry_time,
        expiry_date        : modules.trade.expiry_date,
        market_close_times : modules.trade.market_close_times,
        market_open_times  : modules.trade.market_open_times,
        onChange           : modules.trade.onChange,
        server_time        : common.server_time,
    })
)(TradingTimePicker);
