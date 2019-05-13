import PropTypes   from 'prop-types';
import React       from 'react';
import { NavLink } from 'react-router-dom';

// TODO: use BinaryLink once it supports nested routes
const MenuItem = ({ title, Icon, description,  path }) => {
    const itemContent = (
        <React.Fragment>
            <Icon />
            <div className='menu-item__content'>
                <div className='menu-item__title'>{title}</div>
                <div className='menu-item__description'>{description}</div>
            </div>
        </React.Fragment>
    );

    return (
        path ?
            <NavLink className='menu-item' to={path} activeClassName='menu-item--active'>
                {itemContent}
            </NavLink>
            :
            <div className='menu-item'>{itemContent}</div>
    );
};

MenuItem.propTypes = {
    description: PropTypes.string,
    Icon       : PropTypes.element,
    path       : PropTypes.string,
    title      : PropTypes.string,
};

export default MenuItem;
