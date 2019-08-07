import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconMaximize = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path className='color1-stroke color3-stroke' d='M1.5 10.5v4m4 0h-4m9 0h4m0 0v-4m0-9v4m0-4h-4m-5 0h-4m0 0v4' fill='none' strokeLinecap='square' stroke='#2A3052' />
    </svg>
);

IconMaximize.propTypes = {
    className: PropTypes.string,
};

export default IconMaximize;
