import PropTypes from 'prop-types';
import React     from 'react';

const IconWon = ({ className }) => (
    <svg
        className={className}
        xmlns='http://www.w3.org/2000/svg'
        width='48'
        height='48'
        viewBox='0 0 48 48'
    >
        <g fill='none' fillRule='evenodd'>
            <circle cx='24' cy='24' r='24' fill='#4BB4B3' />
            <path
                fill='#FFF'
                d='M33.44 15.44a1.5 1.5 0 012.12 2.12l-15 15a1.5 1.5 0 01-2.12 0l-6-6a1.5 1.5 0 012.12-2.12l4.94 4.939 13.94-13.94z'
            />
        </g>
    </svg>
);

IconWon.propTypes = {
    className: PropTypes.string,
};

export default IconWon;
