import React, { FC } from 'react';
import { Modal } from '../../../../components';
import { VerificationFailed } from '../../screens';

const VerificationFailedModal: FC = () => {
    return (
        <Modal>
            <Modal.Content>
                <VerificationFailed />
            </Modal.Content>
        </Modal>
    );
};

export default VerificationFailedModal;
