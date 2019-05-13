import PropTypes from 'prop-types';
import React     from 'react';

const Transition = ({ children }) => (
    <div className='toast__transition'>
        {children}
    </div>
);

Transition.propTypes = {
    children: PropTypes.element,
};

export default Transition;
