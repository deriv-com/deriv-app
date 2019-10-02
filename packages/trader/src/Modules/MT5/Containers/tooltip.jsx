import PropTypes from 'prop-types';
import React     from 'react';

const Tooltip = ({ message, children }) => (
    <div className='dc-tooltip'>
        {children}
        <span className='dc-tooltiptext'>{message}</span>
    </div>
);

Tooltip.propTypes = {
    message: PropTypes.string,
};

export default Tooltip;
