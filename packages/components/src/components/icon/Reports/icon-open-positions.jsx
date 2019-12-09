import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconOpenPositions = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path className='color1-fill' fill='#7F8397' fillRule='nonzero' d='M11.793 7.5l-1.647-1.646a.5.5 0 0 1 .708-.708l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 0 1-.708-.708L11.793 8.5H5.5a.5.5 0 0 1 0-1h6.293zM12 3h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3v1.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0h9A1.5 1.5 0 0 1 12 1.5V3zm-1 0V1.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V13H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7zM4 4v8h11V4H4z' />
    </svg>
);

IconOpenPositions.propTypes = {
    className: PropTypes.string,
};

export default IconOpenPositions;
