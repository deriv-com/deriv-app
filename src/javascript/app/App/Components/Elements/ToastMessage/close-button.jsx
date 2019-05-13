import PropTypes from 'prop-types';
import React     from 'react';

const CloseButton = ({ onClick }) => (
    <button
        className='toast__close-button'
        type='button'
        onClick={onClick}
    />
);

CloseButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default CloseButton;
