import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconTrade = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <g className='color1-stroke color3-stroke' stroke='#2A3052' fill='none' fillRule='evenodd'>
            <path className='color2-fill stroke-fill' d='M.5 15.5h3V9a.5.5 0 0 0-.5-.5H1a.5.5 0 0 0-.5.5v6.5zM6.5 15.5h3V5a.5.5 0 0 0-.5-.5H7a.5.5 0 0 0-.5.5v10.5zM12.5 15.5h3V1a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5v14.5z' />
        </g>
    </svg>
);

IconTrade.propTypes = {
    className: PropTypes.string,
};

export { IconTrade };
