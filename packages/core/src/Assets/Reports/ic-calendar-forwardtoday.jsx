import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconCalendarForwardToday = ({ className, onClick }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16' onClick={onClick}>
        <path className='color1-fill'  fill='#000' fillOpacity='.8' fillRule='evenodd' d='M5 3v.5a.5.5 0 0 1-1 0V3H2v2h12V3h-2v.5a.5.5 0 1 1-1 0V3H5zm0-1h6v-.5a.5.5 0 1 1 1 0V2h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2v-.5a.5.5 0 0 1 1 0V2zM2 6v8h12V6H2zm7.793 4L8.646 8.854a.5.5 0 1 1 .708-.708l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708-.708L9.793 10zm-3 0L5.646 8.854a.5.5 0 1 1 .708-.708l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708-.708L6.793 10z' />
    </svg>
);

IconCalendarForwardToday.propTypes = {
    className: PropTypes.string,
    onClick  : PropTypes.func,
};

export default IconCalendarForwardToday;
