import PropTypes from 'prop-types';
import React from 'react';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import { connect } from 'Stores/connect';
import { getDurationMinMaxValues } from '@deriv/shared';
import Duration from './duration.jsx';

const DurationWrapper = props => {
    const {
        advanced_duration_unit,
        advanced_expiry_type,
        duration,
        duration_unit,
        expiry_type,
        getDurationFromUnit,
        is_advanced_duration,
        onChange,
        onChangeUiStore,
        simple_duration_unit,
        contract_expiry_type,
        duration_min_max,
        duration_units_list,
        onChangeMultiple,
    } = props;

    const hasDurationUnit = (duration_type, is_advanced) => {
        let duration_list = [...duration_units_list];

        if (duration_list.length > 1 && !is_advanced) {
            duration_list = duration_list.filter(du => du.value === 'm' || du.value === 't');
        }

        return duration_list.some(du => du.value === duration_type);
    };

    const setDurationUnit = () => {
        if (duration_units_list?.length > 0) {
            const new_duration_unit = duration_units_list[0].value;
            const new_duration_value = getDurationFromUnit(new_duration_unit);

            onChangeUiStore({
                name: `${is_advanced_duration ? 'advanced' : 'simple'}_duration_unit`,
                value: new_duration_unit,
            });
            onChangeMultiple({
                duration_unit: new_duration_unit,
                duration: +new_duration_value,
            });
        }
    };

    const handleEndTime = () => {
        const symbol_has_endtime = duration_units_list.length > 1 || is_advanced_duration;

        if (symbol_has_endtime) {
            // simple duration does not have endtime
            if (!is_advanced_duration) onChangeUiStore({ name: 'is_advanced_duration', value: true });

            onChangeUiStore({ name: 'advanced_expiry_type', value: 'endtime' });
        } else {
            // If query string contains endtime but contract type does not e.g. digits (only ticks contracts)
            onChange({ target: { name: 'expiry_type', value: 'duration' } });
        }
    };

    const assertDurationIsWithinBoundary = React.useCallback(
        current_duration => {
            const [min_value, max_value] = getDurationMinMaxValues(
                duration_min_max,
                contract_expiry_type,
                duration_unit
            );
            if (contract_expiry_type === 'tick' && current_duration < min_value) {
                onChangeUiStore({ name: `duration_${duration_unit}`, value: min_value });
                onChange({ target: { name: 'duration', value: min_value } });
            }

            if (!(current_duration < min_value) && current_duration > max_value && duration_unit !== 'd') {
                onChangeUiStore({ name: `duration_${duration_unit}`, value: max_value });
                onChange({ target: { name: 'duration', value: max_value } });
            }
        },
        [contract_expiry_type, duration_unit, duration_min_max, onChange, onChangeUiStore]
    );

    React.useEffect(() => {
        if (duration_unit === 'd') {
            onChangeUiStore({
                name: 'is_advanced_duration',
                value: true,
            });
        }
    }, [duration_unit, onChangeUiStore]);

    React.useEffect(() => {
        const current_unit = is_advanced_duration ? advanced_duration_unit : simple_duration_unit;
        const current_duration = getDurationFromUnit(current_unit);

        if (duration_unit !== current_unit) {
            onChangeUiStore({
                name: `${is_advanced_duration ? 'advanced' : 'simple'}_duration_unit`,
                value: duration_unit,
            });
        }

        if (+duration !== +current_duration) {
            onChangeUiStore({ name: `duration_${duration_unit}`, value: duration });
        }

        if (expiry_type === 'endtime') handleEndTime();

        assertDurationIsWithinBoundary(current_duration);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (is_advanced_duration && expiry_type !== advanced_expiry_type) {
            onChange({ target: { name: 'expiry_type', value: advanced_expiry_type } });
        }
    }, [is_advanced_duration, expiry_type, advanced_expiry_type, onChange]);

    // intercept changes to contract duration and check that trade_store and ui_store are aligned.
    React.useEffect(() => {
        const current_duration = getDurationFromUnit(duration_unit);
        const simple_is_not_type_duration = !is_advanced_duration && expiry_type !== 'duration';

        // simple only has expiry type duration
        if (simple_is_not_type_duration) {
            onChange({ target: { name: 'expiry_type', value: 'duration' } });
        }

        if (duration !== current_duration) {
            onChangeUiStore({ name: `duration_${duration_unit}`, value: duration });
        }

        assertDurationIsWithinBoundary(current_duration);
    }, [
        duration_unit,
        is_advanced_duration,
        expiry_type,
        duration,
        assertDurationIsWithinBoundary,
        onChange,
        onChangeUiStore,
        getDurationFromUnit,
    ]);

    const current_duration_unit = is_advanced_duration ? advanced_duration_unit : simple_duration_unit;
    const has_missing_duration_unit = !hasDurationUnit(current_duration_unit, is_advanced_duration);
    const simple_is_missing_duration_unit =
        !is_advanced_duration && simple_duration_unit === 'd' && duration_units_list.length === 4;
    const [min_value, max_value] = getDurationMinMaxValues(duration_min_max, contract_expiry_type, duration_unit);

    if (has_missing_duration_unit || simple_is_missing_duration_unit) {
        setDurationUnit();
    }

    return <Duration hasDurationUnit={hasDurationUnit} max_value={max_value} min_value={min_value} {...props} />;
};

DurationWrapper.propTypes = {
    advanced_duration_unit: PropTypes.string,
    advanced_expiry_type: PropTypes.string,
    contract_expiry_type: PropTypes.string,
    duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration_d: PropTypes.number,
    duration_h: PropTypes.number,
    duration_m: PropTypes.number,
    duration_min_max: PropTypes.object,
    duration_s: PropTypes.number,
    duration_t: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration_unit: PropTypes.string,
    duration_units_list: MobxPropTypes.arrayOrObservableArray,
    expiry_date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    expiry_time: PropTypes.string,
    expiry_type: PropTypes.string,
    getDurationFromUnit: PropTypes.func,
    is_advanced_duration: PropTypes.bool,
    is_minimized: PropTypes.bool,
    market_open_times: PropTypes.array,
    onChange: PropTypes.func,
    onChangeMultiple: PropTypes.func,
    onChangeUiStore: PropTypes.func,
    sessions: MobxPropTypes.arrayOrObservableArray,
    simple_duration_unit: PropTypes.string,
    start_date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    start_time: PropTypes.string,
    symbol: PropTypes.string,
};

export default connect(({ modules, ui }) => ({
    advanced_duration_unit: ui.advanced_duration_unit,
    advanced_expiry_type: ui.advanced_expiry_type,
    contract_type: modules.trade.contract_type,
    contract_expiry_type: modules.trade.contract_expiry_type,
    duration: modules.trade.duration,
    duration_unit: modules.trade.duration_unit,
    duration_units_list: modules.trade.duration_units_list,
    duration_min_max: modules.trade.duration_min_max,
    duration_t: ui.duration_t,
    expiry_date: modules.trade.expiry_date,
    expiry_time: modules.trade.expiry_time,
    expiry_type: modules.trade.expiry_type,
    getDurationFromUnit: ui.getDurationFromUnit,
    is_advanced_duration: ui.is_advanced_duration,
    onChange: modules.trade.onChange,
    onChangeUiStore: ui.onChangeUiStore,
    onChangeMultiple: modules.trade.onChangeMultiple,
    simple_duration_unit: ui.simple_duration_unit,
    start_date: modules.trade.start_date,
    market_open_times: modules.trade.market_open_times,
}))(DurationWrapper);
