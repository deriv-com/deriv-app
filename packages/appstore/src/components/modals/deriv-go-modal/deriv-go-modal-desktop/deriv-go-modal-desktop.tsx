import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { Modal } from '@deriv/components';
import './deriv-go-modal-desktop.scss';

export const DerivGoModalDesktop = observer(() => {
    const { traders_hub } = useStore();
    const { is_deriv_go_modal_visible, setIsDerivGoModalVisible } = traders_hub;

    const handleModalClose = () => {
        setIsDerivGoModalVisible(false);
    };

    return (
        <Modal
            is_open={is_deriv_go_modal_visible}
            toggleModal={handleModalClose}
            height='438px'
            width='701px'
            should_header_stick_body={false}
            has_close_icon
            title={localize('Trade with Deriv GO')}
        >
            {/* <Modal.Body>Deriv go Desktop</Modal.Body> */}
            Deriv go Desktop
        </Modal>
    );
});
