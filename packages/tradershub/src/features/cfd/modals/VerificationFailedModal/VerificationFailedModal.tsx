import React from 'react';
import { Modal } from '../../../../components';
import { VerificationFailed } from '../../screens';

const VerificationFailedModal = () => {
    return (
        <Modal>
            <Modal.Content>
                <VerificationFailed />
            </Modal.Content>
        </Modal>
    );
};

export default VerificationFailedModal;
