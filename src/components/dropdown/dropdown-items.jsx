import PropTypes          from 'prop-types';
import React from 'react';
import '../../assets/sass/dropdown/_dropdown-items.scss';

const DropdownItems = (
    {
        className,
        isOpen,
        children,
    }
) => (
    <div className={`dropdown-items ${className} ${isOpen ? 'open' : ''}`}>
        {children}
    </div>
);

DropdownItems.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    className: PropTypes.string,
    isOpen   : PropTypes.bool,
};

export default DropdownItems;
