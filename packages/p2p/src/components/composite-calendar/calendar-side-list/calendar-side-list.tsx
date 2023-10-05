import React from 'react';
import { toMoment } from '@deriv/shared';
import ListItem from './list-item';

type TItem = {
    value: string;
    label: string;
    duration: number;
};

type TCalendarSideListProps = {
    from: number;
    items: Array<TItem>;
    onClickItem: (duration?: number) => void;
    to: number;
};

/**
 * The below function checks whether the time range (defined by from and to) matches a specified duration (flag) in days.
 * If duration is 0, it checks for a specific case ("All time"), and if it's not 0, it checks for the duration specified by duration param.
 * If duration is not equal to 0, the function calculates the duration of the time range in days.
 * It does this by dividing the number of seconds from the end time to the start time by the number of seconds in a day (86400).
 * The result is a boolean value indicating whether the time range is active for the specified duration.
 * @param {number} from
 * @param {number} to
 * @param {number} duration
 * @returns {boolean}
 */
const isActive = (from: number, to: number, duration: number) => {
    if (duration === 0) {
        return toMoment().endOf('day').unix() === to && from === null;
    }
    return Math.ceil(to / 86400) - Math.ceil(from / 86400) === duration;
};

const CalendarSideList = ({ items, from, onClickItem, to }: TCalendarSideListProps) => (
    <ul className='calendar-side-list'>
        {items.map(({ duration, label }) => {
            const is_active = isActive(from, to, duration);
            return (
                <ListItem key={duration} is_active={is_active} label={label} onClick={() => onClickItem(duration)} />
            );
        })}
    </ul>
);

export default CalendarSideList;
