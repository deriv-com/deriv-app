import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconTheme = ({ className }) => (
    <svg
        className={classNames('inline-icon', className)}
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
    >
        <g fill='none' fillRule='evenodd'>
            <path
                fill='#000'
                className='color1-fill'
                fillOpacity='0.8'
                d='M8 15A7 7 0 0 0 8 1v14zm0 1a7.982 7.982 0 0 1-6.1-2.823A8 8 0 1 1 8 16z'
            />
        </g>
    </svg>
);

IconTheme.propTypes = {
    className: PropTypes.string,
};

export default IconTheme;
