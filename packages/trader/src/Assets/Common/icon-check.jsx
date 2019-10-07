import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconCheck = ({ className, onClick }) => (
    <svg
        viewBox='0 0 24 24'
        width='24'
        height='24'
        className={classNames('inline-icon', className)}
        onClick={onClick}
    >
        <g fill='none' fillRule='evenodd'>
            <path d='M0 0h24v24H0z' />
            <path fill='#FFF' fillRule='nonzero' d='M9 16.2l-3.5-3.5a.984.984 0 0 0-1.4 0 .984.984 0 0 0 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7a.984.984 0 0 0 0-1.4.984.984 0 0 0-1.4 0L9 16.2z' />
        </g>
    </svg>
);

IconCheck.propTypes = {
    className: PropTypes.string,
    onClick  : PropTypes.func,
};

export default IconCheck;
