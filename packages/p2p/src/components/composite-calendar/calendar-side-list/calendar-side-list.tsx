import React from 'react';
import { toMoment } from '@deriv/shared';
import ListItem from './list-item';

type TItem = {
    value: string;
    label: string;
    onClick: () => void;
    duration: number;
};

type TCalendarSideListProps = {
    from: number;
    items: Array<TItem>;
    to: number;
};

const isActive = (from: number, to: number, flag: number) => {
    if (flag === 0) {
        return toMoment().endOf('day').unix() === to && from === null;
    }
    return Math.ceil(to / 86400) - Math.ceil(from / 86400) === flag;
};

const CalendarSideList = ({ items, from, to }: TCalendarSideListProps) => (
    <ul className='calendar-side-list'>
        {items.map(({ duration, label, onClick }) => {
            const is_active = isActive(from, to, duration);
            return <ListItem key={duration} is_active={is_active} label={label} onClick={onClick} />;
        })}
    </ul>
);

export default CalendarSideList;
