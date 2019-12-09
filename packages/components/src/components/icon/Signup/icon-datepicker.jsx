import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconDatepicker = ({ className }) => (

    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        viewBox='0 0 16 16'
        className={classNames('inline-icon', className)}
    >
        <path
            fill='#333'
            fillRule='nonzero'
            d='M11.5 1a.5.5 0 0 1 .5.5V2h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2v-.5a.5.5 0 0 1 1 0V2h6v-.5a.5.5 0 0 1 .5-.5zM14 6H2v8h12V6zm-3-3H5v.5a.5.5 0 0 1-1 0V3H2v2h12V3h-2v.5a.5.5 0 1 1-1 0V3z'
        />
    </svg>
);

IconDatepicker.propTypes = {
    className: PropTypes.string,
};

export default IconDatepicker;

