import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconDeposit = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path className='color1-fill' d='M8.5 11.413l2.675-2.293a.5.5 0 0 1 .65.76l-3.497 2.998a.498.498 0 0 1-.656 0L4.175 9.88a.5.5 0 1 1 .65-.76L7.5 11.413V1.5a.5.5 0 0 1 1 0v9.913zM14 14v-2.5a.5.5 0 1 1 1 0v3a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-3a.5.5 0 1 1 1 0V14h12z' fill='#4CAF50' />
    </svg>
);

IconDeposit.propTypes = {
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
    onClick      : PropTypes.func,
};

export { IconDeposit };
