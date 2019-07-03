import PropTypes from 'prop-types';
import React     from 'react';

const IconClock = ({
    className,
    onClick,
    height = '16',
    width = '16',
}) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 16 16'
        width={width}
        height={height}
        className={className}
        onClick={onClick}
    >
        <g fill='none' fillRule='nonzero' stroke='#5C5C5C'>
            <circle cx='8' cy='8' r='7.5' />
            <path strokeLinecap='round' strokeLinejoin='round' d='M8 3.5v5h3.5' />
        </g>
    </svg>
);

IconClock.propTypes = {
    className: PropTypes.string,
    height   : PropTypes.string,
    onClick  : PropTypes.func,
    width    : PropTypes.string,
};

export default IconClock;
