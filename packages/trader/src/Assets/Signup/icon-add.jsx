import PropTypes  from 'prop-types';
import React      from 'react';

const IconAdd = ({ className }) => (
    <svg
        className={className}
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
    >
        <g fill='none' fillRule='evenodd'>
            <circle cx='12' cy='12' r='12' fill='#FFF' />
            <path
                fill='#FF444F'
                fillRule='nonzero'
                d='M12 6a1 1 0 011 1v4h4a1 1 0 010 2h-4v4a1 1 0 01-2 0v-4H7a1 1 0 110-2h4V7a1 1 0 011-1z'
            />
        </g>
    </svg>
);

IconAdd.propTypes = {
    className: PropTypes.string,
};

export default IconAdd;
