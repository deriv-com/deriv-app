import PropTypes  from 'prop-types';
import React      from 'react';

const IconExclamation = ({ className }) => (
    <svg className={className} width='16' height='16' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'><circle cx='8' cy='8' r='8' fill='#FFC107' />
            <g fill='#FFF' transform='matrix(1 0 0 -1 6.5 12)'>
                <circle cx='1.5' cy='1' r='1' />
                <path d='M1.5 3c.6 0 1 .4 1 1v3a1 1 0 1 1-2 0V4c0-.6.4-1 1-1z' />
            </g>
        </g>
    </svg>
);

IconExclamation.propTypes = {
    className: PropTypes.string,
};

export default IconExclamation;
