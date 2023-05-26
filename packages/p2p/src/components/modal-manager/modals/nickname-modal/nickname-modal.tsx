import React from 'react';
import { Modal } from '@deriv/components';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import NicknameForm from 'Components/nickname-form';
import { useStores } from 'Stores';

const NicknameModal = () => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { general_store } = useStores();

    return (
        <Modal
            width='440px'
            is_open={is_modal_open}
            renderTitle={() => <></>}
            toggleModal={() => {
                hideModal();
                general_store.onNicknamePopupClose();
            }}
        >
            <NicknameForm onCancel={hideModal} />
        </Modal>
    );
};

export default NicknameModal;
