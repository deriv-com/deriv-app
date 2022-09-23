import PropTypes from 'prop-types';
import React from 'react';

const BottomWidgets = ({ Widget }) => <div className='bottom-widgets'>{Widget}</div>;

BottomWidgets.propTypes = {
    Widget: PropTypes.node,
};

export default BottomWidgets;
