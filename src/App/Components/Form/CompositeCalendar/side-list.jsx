import PropTypes         from 'prop-types';
import React             from 'react';
import { toMoment }      from 'Utils/Date';
import ListItem          from './list-item.jsx';

const isActive = (from, to, flag) => {
    if (flag === 0) {
        return toMoment().endOf('day').unix() === to && from === null;
    }
    return Math.ceil(to / 86400) - Math.ceil(from / 86400) === flag;

};

const SideList = ({ items, from, to }) => (
    <ul className='composite-calendar__prepopulated-list'>
        {
            items.map(item => {
                const { duration, ...rest_of_props } = item;
                const is_active = isActive(from, to, duration);
                return (
                    <ListItem key={duration} is_active={is_active} {...rest_of_props } />
                );
            })
        }
    </ul>
);

SideList.propTypes = {
    items: PropTypes.array,
};

export default SideList;
