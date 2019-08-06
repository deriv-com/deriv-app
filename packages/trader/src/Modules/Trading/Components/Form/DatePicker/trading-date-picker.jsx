import PropTypes                      from 'prop-types';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import React                          from 'react';
import DatePicker                     from 'App/Components/Form/DatePicker';
import { connect }                    from 'Stores/connect';
import ContractType                   from 'Stores/Modules/Trading/Helpers/contract-type';
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
        is_read_only,
        error_messages,
        value;

    const has_intraday_unit = hasIntradayDurationUnit(duration_units_list);
    const min_duration = has_intraday_unit ? toMoment(server_time).clone() : toMoment(server_time).clone().add(duration_min_max.daily.min, 'second');
    const moment_contract_start_date_time =
        setTime(toMoment(min_duration), (isTimeValid(start_time) ? start_time : server_time.format('HH:mm:ss')));

    const max_daily_duration   = duration_min_max.daily ? duration_min_max.daily.max : 365 * 24 * 3600;

    if (is_24_hours_contract) {
        min_date_expiry   = moment_contract_start_date_time.clone().startOf('day');
        max_date_duration = moment_contract_start_date_time.clone().add(
            start_date ? 24 * 3600 : (max_daily_duration), 'second');
    } else {
        min_date_expiry   = moment_contract_start_date_time.clone().startOf('day');
        max_date_duration = moment_contract_start_date_time.clone().add(max_daily_duration, 'second');
    }

    const is_duration_contract = expiry_type === 'duration';

    if (is_duration_contract) {
        if (has_intraday_unit) {
            min_date_expiry.add(1, 'day');
        }
        has_today_btn  = false;
        is_read_only   = false;
        error_messages = validation_errors.duration;
        value     = duration_d;
    } else {
        has_today_btn  = true;
        is_read_only   = true;
        error_messages = validation_errors.expiry_date;
        value     = expiry_date;
    }

    const label = duration_units_list.length === 1 ? duration_units_list[0].text : null;

    const onChangeCalendarMonth = async(calendar_date) => {
        const disabled_date = [];
        const disabled_day  = [];

        const trading_events = await ContractType.getTradingEvents(calendar_date, symbol);
        trading_events.forEach(events => {
            const dates = events.dates.split(', '); // convert dates str into array
            const idx = dates.indexOf('Fridays');
            if (idx !== -1) {
                // disable weekends
                disabled_day.push(6, 0); // Sat, Sun
            }
            disabled_date.push({
                dates,
                description: events.descrip,
            });
        });

        return {
            disabled_date,
            disabled_day,
        };
    };

    return (
        <DatePicker
            alignment='left'
            disable_year_selector
            error_messages={error_messages || []}
            has_today_btn={has_today_btn}
            has_range_selection={mode === 'duration'}
            is_nativepicker={false}
            is_read_only={is_read_only}
            label={label}
            max_date={max_date_duration}
            min_date={min_date_expiry}
            mode={mode}
            name={name}
            onChange={onChange}
            onChangeCalendarMonth={onChangeCalendarMonth}
            start_date={start_date}
            value={value}
        />
    );
};

TradingDatePicker.propTypes = {
    duration            : PropTypes.number,
    duration_min_max    : PropTypes.object,
    duration_units_list : MobxPropTypes.arrayOrObservableArray,
    expiry_date         : PropTypes.number,
    expiry_type         : PropTypes.string,
    is_24_hours_contract: PropTypes.bool,
    mode                : PropTypes.string,
    name                : PropTypes.string,
    onChange            : PropTypes.func,
    server_time         : PropTypes.object,
    start_date          : PropTypes.number,
    start_time          : PropTypes.number,
    symbol              : PropTypes.string,
    validation_errors   : PropTypes.object,
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
