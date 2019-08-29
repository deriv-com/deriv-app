import PropTypes from 'prop-types';
import React     from 'react';

const IconEmail = ({ className }) => (
    <svg className={className} width='16' height='16' viewBox='0 0 16 16' fill='none'>
        <path d='M14 2H2C1.44772 2 1 2.44772 1 3V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V3C15 2.44772 14.5523 2 14 2ZM14 3V3.22L8 6.91L2 3.22V3H14ZM2 13V4.39L7.74 7.93C7.90089 8.02289 8.09911 8.02289 8.26 7.93L14 4.39V13H2Z' fill='#999999' />
    </svg>
);

IconEmail.propTypes = {
    className: PropTypes.string,
};

export default IconEmail;
