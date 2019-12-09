import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconReports = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <g className='color2-fill' fill='none' fillRule='evenodd'>
            <g className='color1-stroke' stroke='#2A3052'>
                <path d='M12.5 15.5V4.207L8.79.5H1a.5.5 0 0 0-.5.5v14a.5.5 0 0 0 .5.5h11.5zM12.5 6.5v9H14a1.5 1.5 0 0 0 1.5-1.5V7a.5.5 0 0 0-.5-.5h-2.5z' />
            </g>
            <path className='color1-fill' d='M3.5 5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1 0-1zm0 2h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1 0-1zm0 2h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1 0-1zm0 2h3a.5.5 0 1 1 0 1h-3a.5.5 0 1 1 0-1z' fill='#2A3052' />
        </g>
    </svg>
);

IconReports.propTypes = {
    className: PropTypes.string,
};

export default IconReports;
