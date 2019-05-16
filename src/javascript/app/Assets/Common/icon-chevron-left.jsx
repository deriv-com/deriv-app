import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconChevronLeft = ({ className, classNamePath }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path className={classNamePath || 'color1-fill'} fill='rgba(0, 0, 0, 0.8)' fillRule='evenodd' d='M6.247 8l4.587 4.128a.5.5 0 0 1-.668.744l-5-4.5a.5.5 0 0 1 0-.744l5-4.5a.5.5 0 0 1 .668.744L6.247 8z' />
    </svg>
);

IconChevronLeft.propTypes = {
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
};

export default IconChevronLeft;
