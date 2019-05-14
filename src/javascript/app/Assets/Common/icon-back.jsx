import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconBack = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path className='color1-fill' fill='rgba(0, 0, 0, 0.8)' fillRule='evenodd' d='M3.613 8.5l3.26 3.668a.5.5 0 1 1-.747.664l-4-4.5a.5.5 0 0 1 0-.664l4-4.5a.5.5 0 0 1 .748.664L3.614 7.5H13.5a.5.5 0 1 1 0 1H3.613z' />
    </svg>
);

IconBack.propTypes = {
    className: PropTypes.string,
};

export { IconBack };
