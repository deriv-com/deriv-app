import PropTypes        from 'prop-types';
import React            from 'react';
import {
    Modal,
}                       from '@deriv/components';
import { connect }      from '../stores/connect';
import '../assets/sass/google-drive.scss';
import '../assets/sass/load-modal.scss';

const LoadModal = ({
    is_load_modal_open,
    toggleLoadModal,
}) => {

    return (
        <Modal
            title={'Load Strategy'}
            className='modal--load'
            width='384px'
            is_open={is_load_modal_open}
            toggleModal={toggleLoadModal}
        >
            <p>Load Modal</p>
        </Modal>
    );
};

LoadModal.propTypes = {
    is_load_modal_open: PropTypes.bool,
    toggleLoadModal   : PropTypes.func,
};

export default connect(({ load_modal }) => ({
    is_load_modal_open: load_modal.is_load_modal_open,
    toggleLoadModal   : load_modal.toggleLoadModal,
}))(LoadModal);
