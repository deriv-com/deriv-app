import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconCalendar = ({ className, onClick }) => (
    <svg
       
        width='16'
        height='16'
        className={classNames('inline-icon', className)}
        onClick={onClick}
    >
        <path className='color1-fill' fill='#000' fillOpacity='.8' fillRule='nonzero' d='M4 3H2v11h12V3h-2v.5a.5.5 0 1 1-1 0V3H5v.5a.5.5 0 0 1-1 0V3zm1-1h6v-.5a.5.5 0 1 1 1 0V2h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2v-.5a.5.5 0 0 1 1 0V2zM2 5h12v1H2V5z' />
    </svg>
);

IconCalendar.propTypes = {
    className: PropTypes.string,
    onClick  : PropTypes.func,
};

export default IconCalendar;
