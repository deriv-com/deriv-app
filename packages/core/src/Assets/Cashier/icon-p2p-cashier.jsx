import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconP2PCashier = ({ className }) => (
    <svg className={classNames('inline-icon', className)} xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'>
            <path className='color1-fill' fill='#000' fillRule='nonzero' d='M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0-1a8 8 0 1 0 0 16A8 8 0 0 0 8 0z' />
            <path className='color1-stroke' stroke='#000' strokeLinecap='round' strokeLinejoin='round' d='M12.5 6.5h-9l3-3M3.5 9.5h9l-3 3' />
        </g>
    </svg>
);

IconP2PCashier.propTypes = {
    className: PropTypes.string,
};

export default IconP2PCashier;
