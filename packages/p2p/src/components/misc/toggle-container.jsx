import PropTypes from 'prop-types';
import React from 'react';
import './toggle-container.scss';

const ToggleContainer = ({ children }) => <div className='toggle-container'>{children}</div>;

ToggleContainer.propTypes = {
    children: PropTypes.any,
};

export default ToggleContainer;
