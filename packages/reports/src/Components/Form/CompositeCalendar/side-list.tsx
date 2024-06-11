import React from 'react';
import { toMoment } from '@deriv/shared';
import ListItem from './list-item';

type TItem = {
    value: string;
    label: string;
    onClick: () => void;
    duration: number;
};

type TSideList = {
    from: number | null;
    items: Array<TItem>;
    to: number;
};

const isActive = (from: number | null, to: number, flag: number) => {
    if (flag === 0) {
        return toMoment().endOf('day').unix() === to && from === null;
    }
    return Math.ceil(to / 86400) - Math.ceil(Number(from) / 86400) === flag;
};

const SideList = ({ items, from, to }: TSideList) => (
    <ul className='composite-calendar__prepopulated-list'>
        {items.map(item => {
            const { duration, label, onClick } = item;
            const is_active = isActive(from, to, duration);
            return <ListItem key={duration} is_active={is_active} label={label} onClick={onClick} />;
        })}
    </ul>
);

export default SideList;
