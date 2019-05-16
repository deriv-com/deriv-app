import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconWithdrawal = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path className='color1-fill' d='M7.672 1.122a.498.498 0 0 1 .656 0l3.497 2.998a.5.5 0 1 1-.65.76L8.5 2.587V12.5a.5.5 0 1 1-1 0V2.587L4.825 4.88a.5.5 0 1 1-.65-.76l3.497-2.998zM14 14v-2.5a.5.5 0 1 1 1 0v3a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-3a.5.5 0 1 1 1 0V14h12z' fill='#F44336' />
    </svg>
);

IconWithdrawal.propTypes = {
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
    onClick      : PropTypes.func,
};

export default IconWithdrawal;
