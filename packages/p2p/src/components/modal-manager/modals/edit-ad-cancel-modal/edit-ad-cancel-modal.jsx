import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const EditAdCancelModal = () => {
    const { my_ads_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal has_close_icon={false} is_open={is_modal_open} small title={localize('Cancel your edits?')}>
            <Modal.Body>
                <Text as='p' size='xs' color='prominent'>
                    {localize('If you choose to cancel, the edited details will be lost.')}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    has_effect
                    text={localize('Cancel')}
                    onClick={() => {
                        hideModal();
                        my_ads_store.setShowEditAdForm(false);
                    }}
                    secondary
                    large
                />
                <Button has_effect text={localize("Don't cancel")} onClick={() => hideModal()} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default EditAdCancelModal;
