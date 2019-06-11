import PropTypes from 'prop-types';
import React from 'react';
import '../../assets/sass/dropdown/_dropdown-header.scss';

const DropdownHeader = (
    {
        className,
        onClick,
        children,
    }
) => (
    <div className={`${className} dropdown-header`} onClick={onClick}>
        {children}
    </div>
);

DropdownHeader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    className: PropTypes.string,
    onclick  : PropTypes.func,
};

export default DropdownHeader;
