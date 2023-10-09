import React from 'react';
import PropTypes from 'prop-types';
import { exportButton as exportButtonStyle } from '../style';

const ExportButton = ({ onClick, customStyle }) => (
    <button onClick={onClick} style={{ ...exportButtonStyle, ...customStyle }} className='icon-save' />
);

ExportButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    customStyle: PropTypes.object,
};

export default ExportButton;
