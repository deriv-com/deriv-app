import PropTypes from 'prop-types';
import React     from 'react';

const IconRedArrow = ({ className }) => (
    <svg className={className} width='50' height='19' xmlns='http://www.w3.org/2000/svg'>
        <path d='M31 11H0V8h31V0l19 9.5L31 19z' fill='#FF444F' />
    </svg>
);

IconRedArrow.propTypes = {
    className: PropTypes.string,
};

export default IconRedArrow;
