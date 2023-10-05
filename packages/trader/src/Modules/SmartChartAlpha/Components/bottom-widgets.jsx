import PropTypes from 'prop-types';
import React from 'react';

const BottomWidgetsAlpha = ({ Widget }) => <div className='bottom-widgets'>{Widget}</div>;

BottomWidgetsAlpha.propTypes = {
    Widget: PropTypes.node,
};

export default BottomWidgetsAlpha;
