import PropTypes                      from 'prop-types';
import React                          from 'react';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import { connect }                    from 'Stores/connect';
import Duration                       from './duration.jsx';

class DurationWrapper extends React.Component {
    hasDurationUnit = (duration_unit) => {
        let duration_list = [...this.props.duration_units_list];

        if (this.props.duration_units_list.length > 1 && !this.props.is_advanced_duration) {
            duration_list = duration_list.filter(du => du.value === 'm' || du.value === 't');
        }
        return duration_list.some(du => du.value === duration_unit);
    };

    setDurationUnit() {
        const new_duration_unit  = this.props.duration_units_list[0].value;
        const new_duration_value = this.props.getDurationFromUnit(new_duration_unit);

        this.props.onChangeUiStore({ name: `${this.props.is_advanced_duration ? 'advanced' : 'simple'}_duration_unit`, value: new_duration_unit });
        this.props.onChangeMultiple({
            duration_unit: new_duration_unit,
            duration     : +new_duration_value,
        });
    }

    advancedHasWrongExpiry = () => (this.props.is_advanced_duration
        && this.props.expiry_type !== this.props.advanced_expiry_type && this.props.duration_units_list.length > 1);

    handleEndTime = () => {
        const symbol_has_endtime = this.props.duration_units_list.length > 1;

        if (symbol_has_endtime) {
            // simple duration does not have endtime
            if (!this.props.is_advanced_duration) this.props.onChangeUiStore({ name: 'is_advanced_duration', value: true });

            this.props.onChangeUiStore({ name: 'advanced_expiry_type', value: 'endtime' });
        } else {
            // If query string contains endtime but contract type does not e.g. digits (only ticks contracts)
            this.props.onChange({ target: { name: 'expiry_type', value: 'duration' } });
        }
    }

    componentDidMount() {
        const current_unit = this.props.is_advanced_duration ?
            this.props.advanced_duration_unit : this.props.simple_duration_unit;
        const current_duration = this.props.getDurationFromUnit(this.props.duration_unit);

        if (this.props.duration_unit !== current_unit) {
            this.props.onChangeUiStore({ name: `${this.props.is_advanced_duration ? 'advanced' : 'simple'}_duration_unit`, value: this.props.duration_unit });
        }

        if (this.props.duration !== current_duration) {
            this.props.onChangeUiStore({ name: `duration_${current_unit}`, value: this.props.duration });
        }

        if (this.props.expiry_type === 'endtime') this.handleEndTime();

        if (this.advancedHasWrongExpiry()) {
            this.props.onChange({ target: { name: 'expiry_type', value: this.props.advanced_expiry_type } });
        }
    }

    // intercept changes to contract duration and check that trade_store and ui_store are aligned.
    componentWillReact() {
        const simple_is_missing_duration_unit = (!this.props.is_advanced_duration && this.props.simple_duration_unit === 'd' && this.props.duration_units_list.length === 4);
        const current_duration_unit           = (this.props.is_advanced_duration ?
            this.props.advanced_duration_unit : this.props.simple_duration_unit);
        const current_duration                = this.props.getDurationFromUnit(this.props.duration_unit);
        const has_missing_duration_unit       = !this.hasDurationUnit(current_duration_unit);
        const simple_is_not_type_duration     = (!this.props.is_advanced_duration && this.props.expiry_type !== 'duration');

        if (has_missing_duration_unit || simple_is_missing_duration_unit) {
            this.setDurationUnit();
            return;
        }

        // simple only has expiry type duration
        if (simple_is_not_type_duration) {
            this.props.onChange({ target: { name: 'expiry_type', value: 'duration' } });
        }

        if (this.advancedHasWrongExpiry()) {
            this.props.onChange({ target: { name: 'expiry_type', value: this.props.advanced_expiry_type } });
        }

        if (this.props.duration !== current_duration) {
            this.props.onChangeUiStore({ name: `duration_${this.props.duration_unit}`, value: this.props.duration });
        }
    }

    render() {
        return (
            <Duration
                hasDurationUnit={this.hasDurationUnit}
                {...this.props}
            />
        );
    }
}

DurationWrapper.propTypes = {
    advanced_duration_unit: PropTypes.string,
    advanced_expiry_type  : PropTypes.string,
    contract_expiry_type  : PropTypes.string,
    duration              : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_d: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_h: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_m: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_min_max: PropTypes.object,
    duration_s      : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_t: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_unit      : PropTypes.string,
    duration_units_list: MobxPropTypes.arrayOrObservableArray,
    expiry_date        : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    expiry_time         : PropTypes.string,
    expiry_type         : PropTypes.string,
    getDurationFromUnit : PropTypes.func,
    is_advanced_duration: PropTypes.bool,
    is_minimized        : PropTypes.bool,
    market_open_times   : PropTypes.array,
    onChange            : PropTypes.func,
    onChangeMultiple    : PropTypes.func,
    onChangeUiStore     : PropTypes.func,
    sessions            : MobxPropTypes.arrayOrObservableArray,
    simple_duration_unit: PropTypes.string,
    start_date          : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    start_time       : PropTypes.string,
    symbol           : PropTypes.string,
    validation_errors: PropTypes.object,
};

export default connect(({ modules, ui }) => ({
    advanced_duration_unit: ui.advanced_duration_unit,
    advanced_expiry_type  : ui.advanced_expiry_type,
    contract_expiry_type  : modules.trade.contract_expiry_type,
    duration              : modules.trade.duration,
    duration_unit         : modules.trade.duration_unit,
    duration_units_list   : modules.trade.duration_units_list,
    duration_min_max      : modules.trade.duration_min_max,
    duration_t            : ui.duration_t,
    expiry_date           : modules.trade.expiry_date,
    expiry_time           : modules.trade.expiry_time,
    expiry_type           : modules.trade.expiry_type,
    getDurationFromUnit   : ui.getDurationFromUnit,
    is_advanced_duration  : ui.is_advanced_duration,
    onChange              : modules.trade.onChange,
    onChangeUiStore       : ui.onChangeUiStore,
    onChangeMultiple      : modules.trade.onChangeMultiple,
    simple_duration_unit  : ui.simple_duration_unit,
    start_date            : modules.trade.start_date,
    validation_errors     : modules.trade.validation_errors,
    market_open_times     : modules.trade.market_open_times,
}))(DurationWrapper);
