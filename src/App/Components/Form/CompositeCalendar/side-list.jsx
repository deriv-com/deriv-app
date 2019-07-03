import PropTypes from 'prop-types';
import React     from 'react';
import ListItem  from './list-item.jsx';

const SideList = ({ items }) => (
    <ul className='composite-calendar__prepopulated-list'>
        {
            items.map(item => {
                const { duration, is_active, ...rest_of_props } = item;
                return (
                    <ListItem key={duration} is_active={is_active || undefined} {...rest_of_props } />
                );
            })
        }
    </ul>
);

SideList.propTypes = {
    items: PropTypes.array,
};

export default SideList;
