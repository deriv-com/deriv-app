import PropTypes from 'prop-types';
import React     from 'react';

const IconWarning = ({ className }) => (
    <svg className={className} width='16' height='16'>
        <g fill='none' fillRule='evenodd'>
            <circle cx='8' cy='8' r='8' fill='#FFC107' />
            <g fill='#FFF' transform='matrix(1 0 0 -1 6.5 12)'>
                <circle cx='1.5' cy='1' r='1' />
                <path d='M1.5 3a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1z' />
            </g>
        </g>
    </svg>
);

IconWarning.propTypes = {
    className: PropTypes.string,
};

export { IconWarning };
