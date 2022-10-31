import React from 'react';
import PropTypes from 'prop-types';
import { Loading, Modal } from '@deriv/components';

const LoadingModal = ({ is_loading_modal_open }) => {
    return (
        <Modal has_close_icon={false} is_open={is_loading_modal_open} small width='440px'>
            <Loading is_fullscreen={false} />
        </Modal>
    );
};

LoadingModal.propTypes = {
    is_loading_modal_open: PropTypes.bool,
};

export default LoadingModal;
