import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconLogout = ({ className }) => (
    <svg className={classNames('inline-icon', className)} viewBox='0 0 16 16'>
        <path
            className='color1-fill'
            fill='#000'
            fillOpacity='.8'
            fillRule='evenodd'
            d='M14.293 8.5H8.5a.5.5 0 0 1 0-1h5.793l-1.647-1.646a.5.5 0 1 1 .708-.708l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 1 1-.708-.708L14.293 8.5zM11 10.962a.5.5 0 0 1 1 0v1.692C12 13.4 11.38 14 10.625 14h-5.25C4.619 14 4 13.401 4 12.654V3.346C4 2.6 4.62 2 5.375 2h5.25C11.381 2 12 2.599 12 3.346v1.692a.5.5 0 0 1-1 0V3.346C11 3.16 10.836 3 10.625 3h-5.25C5.165 3 5 3.159 5 3.346v9.308c0 .187.164.346.375.346h5.25c.21 0 .375-.159.375-.346v-1.692z'
        />
    </svg>
);

IconLogout.propTypes = {
    className: PropTypes.string,
};

export { IconLogout };
