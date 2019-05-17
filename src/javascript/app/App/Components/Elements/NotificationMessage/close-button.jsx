import PropTypes from 'prop-types';
import React     from 'react';

const CloseButton = ({ onClick, className }) => (
    <button
        className={className}
        type='button'
        onClick={onClick}
    />
);

CloseButton.propTypes = {
    className: PropTypes.string,
    onClick  : PropTypes.func.isRequired,
};

export default CloseButton;
