import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconCalendar = ({ className, ...props }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16' {...props}>
        <g fill='#7F8397' fillRule='nonzero'>
            <path className='color1-fill' d='M4 3H2v11h12V3h-2v.5a.5.5 0 1 1-1 0V3H5v.5a.5.5 0 0 1-1 0V3zm1-1h6v-.5a.5.5 0 1 1 1 0V2h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2v-.5a.5.5 0 0 1 1 0V2zM2 5h12v1H2V5z' />
            <path className='color1-fill' d='M10.134 9H4.5a.5.5 0 0 1 0-1h5.634a1 1 0 1 1 0 1zM4 11h7.5a.5.5 0 1 1 0 1H4v-1z' />
        </g>
    </svg>
);

IconCalendar.propTypes = {
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
    onClick      : PropTypes.func,
};

export default IconCalendar;
