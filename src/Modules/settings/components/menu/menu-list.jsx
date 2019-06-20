import React     from 'react';
import PropTypes from 'prop-types';
import MenuItem  from './menu-item.jsx';

const MenuList = ({ items }) => (
    <div>
        {
            items.map(({ title, description, Icon, path }, i) => (
                <MenuItem
                    key={i}
                    title={title}
                    description={description}
                    Icon={Icon}
                    path={path}
                />
            ))
        }
    </div>
);

MenuList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            description: PropTypes.string,
            Icon       : PropTypes.element,
            path       : PropTypes.string,
            title      : PropTypes.string,
        }),
    ),
};

export default MenuList;
