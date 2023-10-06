import PropTypes from 'prop-types';
import React from 'react';

const BottomWidgetsBeta = ({ Widget }) => <div className='bottom-widgets'>{Widget}</div>;

BottomWidgetsBeta.propTypes = {
    Widget: PropTypes.node,
};

export default BottomWidgetsBeta;
