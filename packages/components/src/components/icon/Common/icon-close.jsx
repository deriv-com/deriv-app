import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconClose = ({ className, onClick }) => (
    <svg onClick={onClick} className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path className='color1-fill' fill='#2A3052' fillRule='nonzero' d='M8 7.293l4.146-4.147a.5.5 0 0 1 .708.708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293z' />
    </svg>
);

IconClose.propTypes = {
    className: PropTypes.string,
};

export default IconClose;
