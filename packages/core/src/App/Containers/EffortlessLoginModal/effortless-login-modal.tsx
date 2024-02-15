import React from 'react';
import { Modal } from '@deriv/components';
import './effortless-login-modal.scss';
import { useShowEffortlessLoginModal } from '@deriv/hooks';
import EffortlessLoginContent from './effortless-login-content';

const EffortlessLoginModal = () => {
    const show_effortless_login_modal = useShowEffortlessLoginModal();

    return (
        <Modal portalId='modal_root_absolute' is_open={show_effortless_login_modal} has_close_icon={false}>
            <EffortlessLoginContent />
        </Modal>
    );
};

export default EffortlessLoginModal;
