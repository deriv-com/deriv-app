import classNames from 'classnames';
import PropTypes from 'prop-types';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import React from 'react';
import { DatePicker } from '@deriv/components';
import { isTimeValid, setTime, toMoment } from '@deriv/shared';
import { localize } from '@deriv/translations';
import Tooltip from 'App/Components/Elements/tooltip.jsx';
import { connect } from 'Stores/connect';
import ContractType from 'Stores/Modules/Trading/Helpers/contract-type';
import { hasIntradayDurationUnit } from 'Stores/Modules/Trading/Helpers/duration';

class TradingDatePicker extends React.Component {
    is_mounted = false;

    state = {
        disabled_days: [],
        market_events: [],
        duration: this.props.duration,
    };

    componentDidMount() {
        this.is_mounted = true;
        this.onChangeCalendarMonth();
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    get has_intraday_unit() {
        return hasIntradayDurationUnit(this.props.duration_units_list);
    }

    get min_duration() {
        const { duration_min_max, server_time } = this.props;

        return this.has_intraday_unit
            ? toMoment(server_time).clone()
            : toMoment(server_time).clone().add(duration_min_max.daily.min, 'second');
    }

    get moment_contract_start_date_time() {
        const { start_time, server_time } = this.props;

        return setTime(
            toMoment(this.min_duration),
            isTimeValid(start_time) ? start_time : server_time.format('HH:mm:ss')
        );
    }

    get max_daily_duration() {
        const { duration_min_max } = this.props;

        return duration_min_max.daily ? duration_min_max.daily.max : 365 * 24 * 3600;
    }

    get min_date_expiry() {
        const is_duration_contract = this.props.expiry_type === 'duration';
        const min_date = this.moment_contract_start_date_time.clone().startOf('day');

        return is_duration_contract && this.has_intraday_unit ? min_date.add(1, 'day') : min_date;
    }

    get max_date_duration() {
        const { is_24_hours_contract, start_date } = this.props;

        return is_24_hours_contract
            ? this.moment_contract_start_date_time
                  .clone()
                  .add(start_date ? 24 * 3600 : this.max_daily_duration, 'second')
            : this.moment_contract_start_date_time.clone().add(this.max_daily_duration, 'second');
    }

    get has_range_selection() {
        return this.props.mode === 'duration';
    }

    get footer() {
        if (!this.has_range_selection) return null;

        const { duration } = this.state;

        if (!duration) return localize('Minimum duration is 1 day');
        if (+duration === 1) return localize('Duration: {{duration}} day', { duration });
        return localize('Duration: {{duration}} days', { duration });
    }

    get datepicker_value() {
        return this.has_range_selection
            ? toMoment().add(this.state.duration, 'days').format('YYYY-MM-DD')
            : this.state.selected_date || this.min_date_expiry;
    }

    onChange = e => {
        if (this.is_mounted) {
            if (this.has_range_selection) {
                this.setState({
                    duration: e.duration,
                });
            } else if (e.target.value) {
                this.setState({
                    selected_date: toMoment(e.target.value),
                });
            }
        }

        const { onChange } = this.props;
        if (typeof onChange === 'function' && e.target) {
            onChange({
                target: {
                    name: e.target.name,
                    value: this.has_range_selection ? e.target.value : toMoment(e.target.value).format('YYYY-MM-DD'),
                },
            });
        }
    };

    onChangeCalendarMonth = async (e = toMoment().format('YYYY-MM-DD')) => {
        const market_events = [];
        let disabled_days = [];

        const events = await ContractType.getTradingEvents(e, this.props.symbol);
        events.forEach(evt => {
            const dates = evt.dates.split(', '); // convert dates str into array
            const idx = dates.indexOf('Fridays');
            if (idx !== -1) {
                disabled_days = [6, 0]; // Sat, Sun
            }
            market_events.push({
                dates,
                descrip: evt.descrip,
            });
        });

        if (this.is_mounted) {
            this.setState({
                disabled_days,
                market_events,
            });
        }
    };

    render() {
        const { id, mode, name, validation_errors } = this.props;

        const has_error = !!validation_errors[name].length;

        return (
            <div
                className={classNames('input-field', {
                    'input-field--has-error': has_error,
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
                        error={validation_errors[name].length ? '' : undefined}
                        mode={mode}
                        max_date={this.max_date_duration}
                        min_date={this.min_date_expiry}
                        name={name}
                        onChange={this.onChange}
                        onChangeCalendarMonth={this.onChangeCalendarMonth}
                        has_range_selection={this.has_range_selection || undefined}
                        has_today_btn={this.has_range_selection ? undefined : true}
                        footer={this.footer}
                        events={this.state.market_events}
                        disabled_days={this.state.disabled_days}
                        keep_open={true}
                        readOnly={!this.has_range_selection}
                        value={this.datepicker_value}
                    />
                </Tooltip>
            </div>
        );
    }
}

TradingDatePicker.propTypes = {
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    duration_min_max: PropTypes.object,
    duration_units_list: MobxPropTypes.arrayOrObservableArray,
    expiry_type: PropTypes.string,
    is_24_hours_contract: PropTypes.bool,
    mode: PropTypes.string,
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
