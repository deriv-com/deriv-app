import PropTypes from 'prop-types';
import React     from 'react';

const IconBarrierDown = ({ className }) => (
    <svg className={className} width='16' height='16'>
        <path
            className='color1-fill'
            fillOpacity='.8'
            fillRule='evenodd'
            d='M7.5 11.793V3.5a.5.5 0 0 1 1 0v8.293l2.646-2.647a.5.5 0 1 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 11.793z'
        />
    </svg>
);

IconBarrierDown.propTypes = {
    className: PropTypes.string,
};

export default IconBarrierDown;
