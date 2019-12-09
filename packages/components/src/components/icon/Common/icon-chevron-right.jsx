import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconChevronRight = ({ className, classNamePath }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path className={classNamePath || 'color1-fill'} fill='rgba(0, 0, 0, 0.8)' fillRule='evenodd' d='M9.753 8L5.166 3.872a.5.5 0 0 1 .668-.744l5 4.5a.5.5 0 0 1 0 .744l-5 4.5a.5.5 0 1 1-.668-.744L9.753 8z' />
    </svg>
);

IconChevronRight.propTypes = {
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
};

export default IconChevronRight;
