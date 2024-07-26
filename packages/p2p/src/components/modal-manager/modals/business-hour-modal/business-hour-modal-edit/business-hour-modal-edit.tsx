import React from 'react';
import classNames from 'classnames';
import { Dropdown, Icon, Text, Tooltip } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { getDropdownList, getHoursList } from 'Utils/business-hours';
import SeparatorContainerLine from 'Components/separator-container-line';
import './business-hour-modal-edit.scss';

type TData = {
    day: string;
    short_day: string;
    time: JSX.Element;
    start_time?: string | null;
    end_time?: string | null;
    value: string;
};

type TBusinessHourModalEditProps = {
    data: TData[];
};

type TDataItem = TBusinessHourModalEditProps['data'][number];

type TEvent = { target: { name: string; value: string } };
type TTimeDropdownProps = {
    idx: number;
    today: number;
    onSelectTime: (e: TEvent, value: string, start_time?: boolean) => void;
    start_time: string;
    end_time: string;
    day: string;
};

const TimeDropdown = ({ idx, today, onSelectTime, start_time, end_time, day }: TTimeDropdownProps) => {
    const time_list = getHoursList();
    return (
        <div
            className={classNames('business-hour-modal-edit__selector-item__dropdown-group', {
                'business-hour-modal-edit__selector-item__dropdown-group--bold': idx === today,
            })}
        >
            <Dropdown
                is_align_text_left
                list={getDropdownList(time_list, 'start', end_time)}
                onChange={(e: TEvent) => onSelectTime(e, day)}
                should_animate_suffix_icon
                suffix_icon='IcArrowDropDown'
                value={start_time}
            />
            <Text size='xxs'>
                <Localize i18n_default_text='to' />
            </Text>
            <Dropdown
                className='business-hour-modal-edit__selector-item__dropdown-group__end-time'
                is_align_text_left
                list={getDropdownList(time_list, 'end', start_time)}
                onChange={(e: TEvent) => onSelectTime(e, day, false)}
                should_animate_suffix_icon
                suffix_icon='IcArrowDropDown'
                value={end_time}
            />
        </div>
    );
};

type TDayState = {
    [key: string]: boolean;
};

const initialDayStates: TDayState = {
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
};

const FULL_DAY = '12:00 am';

const getDropdownOpenStates = (data: TBusinessHourModalEditProps['data']): TDayState => {
    const dayStates = { ...initialDayStates };

    data.forEach(item => {
        // Check if the item contains a valid day and has non-null start_time or end_time
        if (item.day in dayStates && (item.start_time !== null || item.end_time !== null)) {
            dayStates[item.day] = true;
        }
    });

    return dayStates;
};

const BusinessHourModalEdit = React.forwardRef(({ data }: TBusinessHourModalEditProps, ref) => {
    const [edited_data, setEditedData] = React.useState<TData[]>(data);
    const [selected_days, setSelectedDays] = React.useState<string[]>([]);
    const [dropdownOpenStates, setDropdownOpenStates] = React.useState<TDayState>(getDropdownOpenStates(data));
    const today = new Date().getDay();

    React.useImperativeHandle(
        ref,
        () => ({
            getEditedData: () => edited_data,
        }),
        [edited_data]
    );

    React.useEffect(() => {
        const filtered_days = edited_data
            .filter(day => day.start_time !== null && day.end_time !== null)
            .map(day => day.value);

        setSelectedDays(filtered_days);
    }, []);

    const dataLookup: Record<string, TDataItem> = data.reduce((acc, day) => {
        acc[day.value] = day;
        return acc;
    }, {} as Record<string, TDataItem>);

    const onSelectTime = (event: TEvent, value: string, start_time = true) => {
        const new_edited_data = edited_data.map(day => {
            if (day.value === value) {
                if (start_time) {
                    return {
                        ...day,
                        start_time: event.target.value,
                    };
                }
                return {
                    ...day,
                    end_time: event.target.value,
                };
            }
            return day;
        });

        setEditedData(new_edited_data);
    };

    const onClickDay = (value: string) => {
        // Add the day if it's not in the list, otherwise remove it and also set the start_time and end_time to null in edited_data
        const new_selected_days = selected_days.includes(value)
            ? selected_days.filter(day => day !== value)
            : [...selected_days, value];

        const new_edited_data = edited_data.map(day => {
            if (day.value === value) {
                return {
                    ...day,
                    start_time: selected_days.includes(value) ? null : FULL_DAY,
                    end_time: selected_days.includes(value) ? null : FULL_DAY,
                };
            }
            return day;
        });

        if (dropdownOpenStates[value]) toggleDropdown(value);
        setSelectedDays(new_selected_days);
        setEditedData(new_edited_data);
    };

    const onReset = (value: string) => {
        const new_edited_data = data.map(day => {
            if (day.value === value) {
                const initialDay = dataLookup[value];

                if (initialDay) {
                    // If the initial day is a full day(ie. 24hrs => 1440minutes) or if the day was closed previously, toggle the dropdown
                    if (
                        (initialDay.end_time === FULL_DAY && initialDay.start_time === FULL_DAY) ||
                        (initialDay.start_time === null && initialDay.end_time === null)
                    ) {
                        toggleDropdown(value);
                        return {
                            ...day,
                            start_time: FULL_DAY,
                            end_time: FULL_DAY,
                        };
                    }
                    // Return a new object with original start_time and end_time
                    return {
                        ...day,
                        start_time: initialDay.start_time,
                        end_time: initialDay.end_time,
                    };
                }
            }
            return day;
        });

        setEditedData(new_edited_data);
    };

    const toggleDropdown = (value: string) => {
        setDropdownOpenStates({
            ...dropdownOpenStates,
            [value]: !dropdownOpenStates[value],
        });
    };

    return (
        <div className='business-hour-modal-edit'>
            <div className='business-hour-modal-edit__days'>
                {edited_data.map(day => {
                    const includes_day = selected_days.includes(day.value);

                    return (
                        <Text
                            as='button'
                            className={classNames('business-hour-modal-edit__days-circle', {
                                'business-hour-modal-edit__days-circle--unselected': !includes_day,
                            })}
                            color={includes_day ? 'colored-background' : 'general'}
                            key={day.value}
                            onClick={() => onClickDay(day.value)}
                        >
                            {day.short_day}
                        </Text>
                    );
                })}
            </div>
            <SeparatorContainerLine />
            <div className='business-hour-modal-edit__selector'>
                {edited_data.map((day, idx) => {
                    const text_weight = idx === today ? 'bold' : 'normal';
                    const includes_day = selected_days.includes(day.value);
                    const are_times_null = day.start_time === null && day.end_time === null;
                    const is_full_day = day.start_time === day.end_time;

                    return (
                        <div className='business-hour-modal-edit__selector-item' key={`${day.value}_${day.start_time}`}>
                            <Text
                                className='business-hour-modal-edit__selector-item-text'
                                color={includes_day ? 'general' : 'less-prominent'}
                                size='xxs'
                                weight={text_weight}
                            >
                                {day.day}
                            </Text>
                            <div
                                className={classNames('business-hour-modal-edit__selector-item__dropdown', {
                                    'business-hour-modal-edit__selector-item__dropdown--single': !includes_day,
                                })}
                            >
                                {(includes_day && !are_times_null && !is_full_day) || dropdownOpenStates[day.value] ? (
                                    <TimeDropdown
                                        today={today}
                                        idx={idx}
                                        start_time={day.start_time ?? ''}
                                        end_time={day.end_time ?? ''}
                                        onSelectTime={onSelectTime}
                                        day={day.value}
                                    />
                                ) : (
                                    <div
                                        className={classNames(
                                            'business-hour-modal-edit__selector-item__dropdown__open-text',
                                            {
                                                'business-hour-modal-edit__selector-item__dropdown__open-text--disabled':
                                                    !includes_day,
                                            }
                                        )}
                                        onClick={() => toggleDropdown(day.value)}
                                    >
                                        <Text color={includes_day ? 'general' : 'less-prominent'} size='xxs'>
                                            <Localize i18n_default_text='Open 24 hours' />
                                        </Text>
                                        <Icon icon='IcArrowDropDown' />
                                    </div>
                                )}
                            </div>
                            <Tooltip alignment='top' message={localize('Reset to default hours')}>
                                <Icon
                                    className={classNames('business-hour-modal-edit__selector-item__icon', {
                                        'business-hour-modal-edit__selector-item__icon--disabled':
                                            !includes_day || is_full_day,
                                    })}
                                    icon='IcResetTime'
                                    onClick={() => onReset(day.value)}
                                />
                            </Tooltip>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

BusinessHourModalEdit.displayName = 'BusinessHourModalEdit';

export default BusinessHourModalEdit;
