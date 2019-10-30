import PropTypes from 'prop-types';
import React     from 'react';

const IconInfoBlue = ({ className }) => (
    <svg className={className} width='16' height='16' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'>
            <path fill='#2196F3' d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7 4V7a1 1 0 0 0-1-1H6a1 1 0 0 0 1 1v5a1 1 0 0 0 1 1h2a1 1 0 0 0-1-1zm0-8a1 1 0 1 0-2 0 1 1 0 0 0 2 0z' />
            <path d='M0 0h16v16H0z' />
        </g>
    </svg>
);

IconInfoBlue.propTypes = {
    className: PropTypes.string,
};

export default IconInfoBlue;
