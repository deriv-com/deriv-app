import React from 'react';
import { Button, Modal, Text } from '@deriv-com/ui';

type TConnectedAppsRevokeModalProps = {
    handleRevokeAccess: () => void;
    handleToggleModal: (appId?: number | null) => void;
    isModalOpen: boolean;
};

export const ConnectedAppsRevokeModal = ({
    handleRevokeAccess,
    handleToggleModal,
    isModalOpen,
}: TConnectedAppsRevokeModalProps) => (
    <Modal isOpen={isModalOpen} onRequestClose={() => handleToggleModal()} shouldCloseOnOverlayClick>
        <Modal.Body>
            <Text as='p' color='prominent' weight='bold'>
                Confirm revoke access
            </Text>
        </Modal.Body>
        <Modal.Footer hideBorder>
            <Button color='black' onClick={() => handleToggleModal()}>
                Back
            </Button>
            <Button onClick={handleRevokeAccess}>Confirm</Button>
        </Modal.Footer>
    </Modal>
);
