import PropTypes from 'prop-types';
import React from 'react';
import { toMoment } from '@deriv/shared';
import ListItem from './list-item.jsx';
import './calendar-side-list.scss';

const isActive = (from, to, flag) => {
    if (flag === 0) {
        return toMoment().endOf('day').unix() === to && from === null;
    }
    return Math.ceil(to / 86400) - Math.ceil(from / 86400) === flag;
};

const CalendarSideList = ({ items, from, to }) => (
    <ul className='calendar-side-list'>
        {items.map(({ duration, ...rest_of_props }) => {
            const is_active = isActive(from, to, duration);
            return <ListItem key={duration} is_active={is_active} {...rest_of_props} />;
        })}
    </ul>
);

CalendarSideList.propTypes = {
    from: PropTypes.number,
    items: PropTypes.array,
    to: PropTypes.number,
};

export default CalendarSideList;
