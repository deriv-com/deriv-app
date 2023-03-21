import React from 'react';
import { Loading, Modal } from '@deriv/components';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const LoadingModal = () => {
    const { is_modal_open } = useModalManagerContext();

    return (
        <Modal has_close_icon={false} is_open={is_modal_open} small width='440px'>
            <Loading is_fullscreen={false} />
        </Modal>
    );
};

export default LoadingModal;
