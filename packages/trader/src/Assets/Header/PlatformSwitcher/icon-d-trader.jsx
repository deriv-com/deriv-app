import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconDTrader = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='32' height='32' viewBox='0 0 32 32'>
        <g fill='none' fillRule='evenodd'>
            <path fill='#FF444F' d='M-10.018-24H9.92a5.982 5.982 0 0 1 5.981 5.982V1.92a5.982 5.982 0 0 1-5.981 5.981h-19.94A5.982 5.982 0 0 1-16 1.921v-19.94a5.982 5.982 0 0 1 5.982-5.98' />
            <path fill='#FFF' d='M-8.174-18.018l-1.067 3.33 5.324 6.55-5.334 6.49.858 3.569L-.13-8.13z' />
            <path fill='#FFF' d='M-.607-18.018H-6.55l2.484 3.05h3.448a6.979 6.979 0 0 1 6.839 6.98c0 3.8-3.04 6.902-6.839 6.978h-3.734l-2.41 2.93h6.144c5.449-.06 9.82-4.52 9.77-9.969.05-5.445-4.315-9.903-9.76-9.97' />
        </g>
    </svg>
);

IconDTrader.propTypes = {
    className: PropTypes.string,
};

export default IconDTrader;
