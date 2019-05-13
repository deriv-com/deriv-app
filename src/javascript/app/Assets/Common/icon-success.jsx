import PropTypes from 'prop-types';
import React     from 'react';

const IconSuccess = ({ className }) => (
    <svg className={className} width='16' height='16'>
        <g fill='none' fillRule='evenodd'>
            <circle cx='8' cy='8' r='8' fill='#4CAF50' />
            <path fill='#FFF' fillRule='nonzero' d='M6.5 10.793l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L6.5 10.793z' />
        </g>
    </svg>
);

IconSuccess.propTypes = {
    className: PropTypes.string,
};

export { IconSuccess };
