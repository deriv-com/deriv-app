import PropTypes    from 'prop-types';
import classNames   from 'classnames';
import React        from 'react';
import { localize } from 'deriv-translations';
import { toMoment } from 'Utils/Date';

const Dialog = ({
    preClass,
    selected_time,
    end_time,
    start_time,
    onChange,
    className,
}) => {
    const start_time_moment     = start_time
        ? toMoment(start_time)
        : toMoment();
    const end_time_moment       = end_time
        ? toMoment(end_time)
        : toMoment().hour('23').minute('59').seconds('59').milliseconds('999');
    const to_compare_moment     = toMoment();
    const [ hour, minute ]      = selected_time.split(':');
    const hours    = [...Array(24).keys()].map((a)=>`0${a}`.slice(-2));
    const minutes  = [...Array(12).keys()].map((a)=>`0${a * 5}`.slice(-2));

    const selectOption = (type, current_value, prev_value, is_enabled = true) => {
        if (is_enabled && prev_value) {
            const [ prev_hour, prev_minute ] = prev_value.split(':');
            if ((type === 'h' && current_value !== prev_hour) || (type === 'm' && current_value !== prev_minute)) {
                onChange(`${type === 'h' ? current_value : prev_hour}:${type === 'm' ? current_value : prev_minute}`);
            }
        }
    };

    return (
        <div className={classNames(`${preClass}__dialog`, `${className}`)}>
            <div className={`${preClass}__selector`}>
                <div className={`${preClass}__selector--hours`}>
                    <div className={classNames(`${preClass}__selector-list-title`, 'center-text')}><strong>{localize('Hour')}</strong></div>
                    <div>
                        {hours.map((h, key) => {
                            to_compare_moment.hour(h);
                            const start_time_reset_minute = start_time_moment.clone().minute(0);
                            const is_hour_enabled = to_compare_moment.isBetween(
                                start_time_reset_minute,
                                end_time_moment);
                            const is_minute_enabled = to_compare_moment.isBetween(
                                start_time_moment,
                                end_time_moment,
                                'minute');
                            // The minute number after which the last block/interval of `Minutes` selection will be disabled
                            const last_interval_of_hour = 52;
                            const is_enabled = to_compare_moment.minutes() > last_interval_of_hour
                                ? is_hour_enabled && is_minute_enabled
                                : is_hour_enabled;
                            return (
                                <div
                                    className={classNames(`${preClass}__selector-list-item`,
                                        { [`${preClass}__selector-list-item--selected`]: (hour === h) },
                                        { [`${preClass}__selector-list-item--disabled`]: !is_enabled })}
                                    key={key}
                                    onClick={() => { selectOption('h', h, selected_time, is_enabled); }}
                                >
                                    {h}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={`${preClass}__selector--minutes`}>
                    <div className={classNames(`${preClass}__selector-list-title`, 'center-text')}><strong>{localize('Minute')}</strong></div>
                    <div>
                        {minutes.map((mm, key) => {
                            to_compare_moment.hour(hour).minute(mm);
                            const is_enabled = to_compare_moment.isBetween(start_time_moment, end_time_moment, 'minute');
                            return (
                                <div
                                    className={classNames(`${preClass}__selector-list-item`,
                                        { [`${preClass}__selector-list-item--selected`]: (minute === mm) },
                                        { [`${preClass}__selector-list-item--disabled`]: !is_enabled })}
                                    key={key}
                                    onClick={() => { selectOption('m', mm, selected_time, is_enabled); }}
                                >
                                    {mm}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

Dialog.propTypes = {
    className: PropTypes.string,
    end_time : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.object,
    ]),
    onChange     : PropTypes.func,
    preClass     : PropTypes.string,
    selected_time: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.object,
    ]),
    start_time: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.object,
    ]),
};

export default Dialog;
