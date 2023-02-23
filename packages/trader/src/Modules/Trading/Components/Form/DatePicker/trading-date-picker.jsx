import classNames from 'classnames';
import PropTypes from 'prop-types';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import React from 'react';
import { DatePicker, Tooltip } from '@deriv/components';
import { isTimeValid, setTime, toMoment, useIsMounted, hasIntradayDurationUnit } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';

const TradingDatePicker = ({
    duration: current_duration,
    duration_min_max,
    duration_units_list,
    expiry_type,
    id,
    is_24_hours_contract,
    mode,
    name,
    onChange,
    server_time,
    start_date,
    start_time,
    symbol,
    validation_errors,
}) => {
    const isMounted = useIsMounted();

    const [disabled_days, setDisabledDays] = React.useState([]);
    const [market_events, setMarketEvents] = React.useState([]);
    const [duration, setDuration] = React.useState(current_duration);
    const [selected_date, setSelectedDate] = React.useState();

    React.useEffect(() => {
        onChangeCalendarMonth();
    }, [onChangeCalendarMonth]);

    React.useEffect(() => {
        if (duration !== current_duration) {
            setDuration(current_duration);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current_duration]);

    const getMinDuration = () => {
        return hasIntradayDurationUnit(duration_units_list)
            ? toMoment(server_time).clone()
            : toMoment(server_time).clone().add(duration_min_max?.daily?.min, 'second');
    };

    const getMomentContractStartDateTime = () => {
        return setTime(
            toMoment(getMinDuration()),
            isTimeValid(start_time) ? start_time : server_time.format('HH:mm:ss')
        );
    };

    const getMaxDailyDuration = () => {
        return duration_min_max.daily ? duration_min_max.daily.max : 365 * 24 * 3600;
    };

    const getMinDateExpiry = () => {
        const is_duration_contract = expiry_type === 'duration';
        const min_date = getMomentContractStartDateTime().clone().startOf('day');

        return is_duration_contract && hasIntradayDurationUnit(duration_units_list) ? min_date.add(1, 'day') : min_date;
    };

    const getMaxDateDuration = () => {
        return is_24_hours_contract
            ? getMomentContractStartDateTime()
                  .clone()
                  .add(start_date ? 24 * 3600 : getMaxDailyDuration(), 'second')
            : getMomentContractStartDateTime().clone().add(getMaxDailyDuration(), 'second');
    };

    const hasRangeSelection = () => mode === 'duration';

    const getFooter = () => {
        if (!hasRangeSelection()) return null;

        if (!duration) return localize('Minimum duration is 1 day');
        if (+duration === 1) return localize('Duration: {{duration}} day', { duration });
        return localize('Duration: {{duration}} days', { duration });
    };

    const getDatepickerValue = () => {
        return hasRangeSelection()
            ? toMoment().add(duration, 'days').format('YYYY-MM-DD')
            : selected_date || getMinDateExpiry();
    };

    const onChangeDate = e => {
        if (isMounted()) {
            if (hasRangeSelection()) {
                setDuration(e.duration);
            } else if (e.target.value) {
                setSelectedDate(toMoment(e.target.value));
            }
        }

        if (typeof onChange === 'function' && e.target) {
            onChange({
                target: {
                    name: e.target.name,
                    value: hasRangeSelection() ? e.target.value : toMoment(e.target.value).format('YYYY-MM-DD'),
                },
            });
        }
    };

    const onChangeCalendarMonth = React.useCallback(
        async (e = toMoment().format('YYYY-MM-DD')) => {
            const new_market_events = [];
            let new_disabled_days = [];

            const events = await ContractType.getTradingEvents(e, symbol);
            events.forEach(evt => {
                const dates = evt.dates.split(', '); // convert dates str into array
                const idx = dates.indexOf('Fridays');
                if (idx !== -1) {
                    new_disabled_days = [6, 0]; // Sat, Sun
                }
                new_market_events.push({
                    dates,
                    descrip: evt.descrip,
                });
            });

            if (isMounted()) {
                setDisabledDays(new_disabled_days);
                setMarketEvents(new_market_events);
            }
        },
        [isMounted, symbol]
    );

    const has_error = !!validation_errors?.[name]?.length;

    return (
        <div
            className={classNames('dc-input-field', {
                'dc-input-field--has-error': has_error,
            })}
        >
            <Tooltip
                className='trade-container__tooltip'
                alignment='left'
                message={has_error ? validation_errors[name][0] : undefined}
                has_error={has_error}
            >
                <DatePicker
                    id={id}
                    alignment='left'
                    display_format='DD MMM YYYY'
                    show_leading_icon
                    error={validation_errors?.[name]?.length ? '' : undefined}
                    mode={mode}
                    max_date={getMaxDateDuration()}
                    min_date={getMinDateExpiry()}
                    name={name}
                    onChange={onChangeDate}
                    onChangeCalendarMonth={onChangeCalendarMonth}
                    has_range_selection={hasRangeSelection()}
                    has_today_btn={!hasRangeSelection()}
                    footer={getFooter()}
                    events={market_events}
                    disabled_days={disabled_days}
                    keep_open
                    readOnly={!hasRangeSelection()}
                    value={getDatepickerValue()}
                />
            </Tooltip>
        </div>
    );
};

TradingDatePicker.propTypes = {
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    duration_min_max: PropTypes.object,
    duration_units_list: MobxPropTypes.arrayOrObservableArray,
    expiry_type: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_24_hours_contract: PropTypes.bool,
    mode: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    server_time: PropTypes.object,
    start_date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    start_time: PropTypes.string,
    symbol: PropTypes.string,
    validation_errors: PropTypes.object,
};

export default connect(({ modules, common }) => ({
    duration: modules.trade.duration,
    duration_min_max: modules.trade.duration_min_max,
    duration_units_list: modules.trade.duration_units_list,
    expiry_type: modules.trade.expiry_type,
    onChange: modules.trade.onChange,
    server_time: common.server_time,
    start_date: modules.trade.start_date,
    start_time: modules.trade.start_time,
    symbol: modules.trade.symbol,
    validation_errors: modules.trade.validation_errors,
}))(TradingDatePicker);
