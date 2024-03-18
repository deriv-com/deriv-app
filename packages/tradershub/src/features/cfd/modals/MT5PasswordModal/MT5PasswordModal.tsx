import React, { useState } from 'react';
import { useQueryParams } from '@/hooks';
import { Modal, useDevice } from '@deriv-com/ui';
import MT5PasswordFooter from './MT5PasswordFooter';
import MT5PasswordInput from './MT5PasswordInput';

const MT5PasswordModal = () => {
    const [password, setPassword] = useState('');
    const { closeModal, isModalOpen } = useQueryParams();
    const { isDesktop } = useDevice();

    return (
        <Modal ariaHideApp={false} isOpen={isModalOpen('MT5PasswordModal')} onRequestClose={closeModal}>
            <Modal.Header hideBorder={isDesktop} onRequestClose={closeModal} />
            <Modal.Body>
                <MT5PasswordInput password={password} setPassword={setPassword} />
            </Modal.Body>
            {!isDesktop && (
                <Modal.Footer>
                    <MT5PasswordFooter password={password} />
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default MT5PasswordModal;
