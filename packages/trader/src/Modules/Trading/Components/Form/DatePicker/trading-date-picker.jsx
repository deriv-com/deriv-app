import PropTypes                      from 'prop-types';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import React                          from 'react';
import DatePicker                     from 'App/Components/Form/DatePicker';
import { connect }                    from 'Stores/connect';
import { hasIntradayDurationUnit }    from 'Stores/Modules/Trading/Helpers/duration';
import {
    isTimeValid,
    setTime,
    toMoment }                        from 'Utils/Date';

const TradingDatePicker = ({
    duration_d,
    duration_min_max,
    duration_units_list,
    expiry_date,
    expiry_type,
    is_24_hours_contract,
    mode,
    name,
    onChange,
    server_time,
    start_time,
    start_date,
    symbol,
    validation_errors,
}) => {
    let max_date_duration,
        min_date_expiry,
        has_today_btn,
        is_read_only;
    const has_intraday_unit = hasIntradayDurationUnit(duration_units_list);
    const min_duration = has_intraday_unit ? toMoment(server_time).clone() : toMoment(server_time).clone().add(duration_min_max.daily.min, 'second');
    const moment_contract_start_date_time =
        setTime(toMoment(min_duration), (isTimeValid(start_time) ? start_time : server_time.format('HH:mm:ss')));

    const max_daily_duration   = duration_min_max.daily ? duration_min_max.daily.max : 365 * 24 * 3600;
    const is_duration_contract = expiry_type === 'duration';

    if (is_24_hours_contract) {
        min_date_expiry   = moment_contract_start_date_time.clone().startOf('day');
        max_date_duration = moment_contract_start_date_time.clone().add(
            start_date ? 24 * 3600 : (max_daily_duration), 'second');
    } else {
        min_date_expiry   = moment_contract_start_date_time.clone().startOf('day');
        max_date_duration = moment_contract_start_date_time.clone().add(max_daily_duration, 'second');
    }
    if (is_duration_contract) {
        if (has_intraday_unit) {
            min_date_expiry.add(1, 'day');
        }
        has_today_btn = false;
        is_read_only = false;
    } else {
        has_today_btn = true;
        is_read_only = true;
    }

    const tradingDatePickerOnChange = e => {
        const is_same_duration_as_trade_store = (e.target.name === 'duration' && duration_d === e.target.value);

        if (!is_same_duration_as_trade_store) onChange(e);
    };

    const error_messages = is_duration_contract ? validation_errors.duration : validation_errors.expiry_date;
    const date_value = is_duration_contract ? (duration_d || '').toString() : expiry_date;

    return (
        <DatePicker
            alignment='left'
            disable_year_selector
            disable_trading_events
            error_messages={error_messages || []}
            has_today_btn={has_today_btn}
            has_range_selection={mode === 'duration'}
            is_nativepicker={false}
            is_read_only={is_read_only}
            label={duration_units_list.length === 1 ? duration_units_list[0].text : null}
            mode={mode}
            name={name}
            onChange={tradingDatePickerOnChange}
            min_date={min_date_expiry}
            max_date={max_date_duration}
            start_date={start_date}
            underlying={symbol}
            value={date_value}
        />
    );
};

TradingDatePicker.propTypes = {
    duration: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    duration_min_max   : PropTypes.object,
    duration_units_list: MobxPropTypes.arrayOrObservableArray,
    expiry_date        : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    expiry_type         : PropTypes.string,
    is_24_hours_contract: PropTypes.bool,
    mode                : PropTypes.string,
    onChange            : PropTypes.func,
    server_time         : PropTypes.object,
    start_date          : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    start_time       : PropTypes.string,
    symbol           : PropTypes.string,
    validation_errors: PropTypes.object,
};

export default connect(
    ({ modules, common, ui }) => ({
        duration_min_max   : modules.trade.duration_min_max,
        duration_units_list: modules.trade.duration_units_list,
        expiry_date        : modules.trade.expiry_date,
        expiry_type        : modules.trade.expiry_type,
        onChange           : modules.trade.onChange,
        server_time        : common.server_time,
        start_date         : modules.trade.start_date,
        start_time         : modules.trade.start_time,
        symbol             : modules.trade.symbol,
        validation_errors  : modules.trade.validation_errors,
        duration_d         : ui.duration_d,
    })
)(TradingDatePicker);
