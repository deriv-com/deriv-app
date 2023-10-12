import React from 'react';
import { Button, Modal } from '@deriv/components';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { Localize, localize } from 'Components/i18next';

const MyProfileBalanceModal = () => {
    const { hideModal, is_modal_open } = useModalManagerContext() || {};

    return (
        <Modal
            className='my-profile-balance-modal'
            has_close_icon={false}
            is_open={is_modal_open}
            small
            title={localize('Deriv P2P Balance')}
        >
            <Modal.Body className='my-profile-balance-modal__body'>
                <Localize i18n_default_text='Deriv P2P balance = deposits that can’t be reversed' />
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('OK')} onClick={hideModal} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default MyProfileBalanceModal;
