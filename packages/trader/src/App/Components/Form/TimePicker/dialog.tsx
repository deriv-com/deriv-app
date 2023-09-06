import classNames from 'classnames';
import React from 'react';
import { localize } from '@deriv/translations';
import { toMoment } from '@deriv/shared';

type TDialogProps = {
    className: string;
    end_times: moment.Moment[];
    onChange: (arg: string | React.ChangeEvent<HTMLInputElement>) => void;
    preClass: string;
    selected_time: string;
    start_times: moment.Moment[];
};

function isBetween(
    to_compare_moment: moment.Moment,
    start_times_moment: moment.Moment[],
    end_times_moment: moment.Moment[],
    duration?: string
) {
    for (let i = 0; i < start_times_moment.length; i++) {
        if (
            to_compare_moment.isBetween(
                start_times_moment[i],
                end_times_moment[i],
                duration as moment.unitOfTime.StartOf
            )
        ) {
            return true;
        }
    }
    return false;
}

const Dialog = ({ preClass, selected_time, end_times, start_times, onChange, className }: TDialogProps) => {
    const start_times_moment = start_times ? start_times.map(start_time => toMoment(start_time)) : [toMoment()];
    const end_times_moment = end_times
        ? end_times.map(end_time => toMoment(end_time))
        : [toMoment().hour(23).minute(59).seconds(59).milliseconds(999)];
    const to_compare_moment = toMoment();
    const [hour, minute] = selected_time.split(':');
    const hours = [...Array(24).keys()].map(a => `0${a}`.slice(-2));
    const minutes = [...Array(12).keys()].map(a => `0${a * 5}`.slice(-2));

    const selectOption = (type: string, current_value: string, prev_value: string, is_enabled = true) => {
        if (is_enabled && prev_value) {
            const [prev_hour, prev_minute] = prev_value.split(':');
            if ((type === 'h' && current_value !== prev_hour) || (type === 'm' && current_value !== prev_minute)) {
                const selected_hour = type === 'h' ? current_value : prev_hour;
                const selected_minute = type === 'm' ? current_value : prev_minute;
                onChange(`${selected_hour}:${selected_minute}`);
            }
        }
    };

    return (
        <div className={classNames(`${preClass}__dialog`, `${className}`)}>
            <div className={`${preClass}__selector`}>
                <div className={`${preClass}__selector--hours`}>
                    <div className={classNames(`${preClass}__selector-list-title`, 'center-text')}>
                        <strong>{localize('Hour')}</strong>
                    </div>
                    <div>
                        {hours.map(h => {
                            to_compare_moment.hour(Number(h));
                            const start_times_reset_minute = start_times_moment.map(start_time =>
                                start_time.clone().minute(0)
                            );
                            const is_hour_enabled = isBetween(
                                to_compare_moment,
                                start_times_reset_minute,
                                end_times_moment
                            );
                            const is_minute_enabled = isBetween(
                                to_compare_moment,
                                start_times_moment,
                                end_times_moment,
                                'minute'
                            );
                            // The minute number after which the last block/interval of `Minutes` selection will be disabled
                            const last_interval_of_hour = 52;
                            const is_enabled =
                                to_compare_moment.minutes() > last_interval_of_hour
                                    ? is_hour_enabled && is_minute_enabled
                                    : is_hour_enabled;
                            return (
                                <div
                                    className={classNames(
                                        `${preClass}__selector-list-item`,
                                        { [`${preClass}__selector-list-item--selected`]: hour === h },
                                        { [`${preClass}__selector-list-item--disabled`]: !is_enabled }
                                    )}
                                    key={h}
                                    onClick={() => {
                                        selectOption('h', h, selected_time, is_enabled);
                                    }}
                                >
                                    {h}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={`${preClass}__selector--minutes`}>
                    <div className={classNames(`${preClass}__selector-list-title`, 'center-text')}>
                        <strong>{localize('Minute')}</strong>
                    </div>
                    <div>
                        {minutes.map(mm => {
                            to_compare_moment.hour(Number(hour)).minute(Number(mm));
                            const is_enabled = isBetween(
                                to_compare_moment,
                                start_times_moment,
                                end_times_moment,
                                'minute'
                            );
                            return (
                                <div
                                    className={classNames(
                                        `${preClass}__selector-list-item`,
                                        { [`${preClass}__selector-list-item--selected`]: minute === mm },
                                        { [`${preClass}__selector-list-item--disabled`]: !is_enabled }
                                    )}
                                    key={mm}
                                    onClick={() => {
                                        selectOption('m', mm, selected_time, is_enabled);
                                    }}
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

export default Dialog;
