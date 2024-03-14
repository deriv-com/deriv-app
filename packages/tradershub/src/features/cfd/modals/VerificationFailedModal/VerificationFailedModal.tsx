import React from 'react';
import { Modal } from '@/components';
import { VerificationFailed } from '@cfd/screens';

const VerificationFailedModal = () => (
    <Modal>
        <Modal.Content>
            <VerificationFailed />
        </Modal.Content>
    </Modal>
);

export default VerificationFailedModal;
