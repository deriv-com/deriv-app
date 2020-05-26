import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';

const CloseButton = ({ onClick, className }) => (
    <button className={className} type='button' onClick={onClick} aria-label={localize('Close')} />
);

CloseButton.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

export default CloseButton;
