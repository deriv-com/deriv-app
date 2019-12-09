import PropTypes  from 'prop-types';
import React      from 'react';

const IconAdd = ({ className }) => (
    <svg className={className} width='24' height='24' viewBox='0 0 24 24'>
        <g fill='none' fillRule='nonzero'>
            <circle cx='12' cy='12' r='12' fill='#FF444F' />
            <path fill='#FFF' d='M12 6a1 1 0 0 1 1 1v4h4a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 1 1 0-2h4V7a1 1 0 0 1 1-1z' />
        </g>
    </svg>
);

IconAdd.propTypes = {
    className: PropTypes.string,
};

export default IconAdd;
