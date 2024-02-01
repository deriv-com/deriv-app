import React, { useState } from 'react';
import { useBreakpoint } from '@deriv/quill-design';
import { Dialog, Modal } from '../../../../components';
import FooterComponent from './FooterComponent';
import PasswordComponent from './PasswordComponent';

const DxtradePasswordModal = () => {
    const { isMobile } = useBreakpoint();
    const [password, setPassword] = useState('');

    if (isMobile) {
        return (
            <Modal>
                <Modal.Content>
                    <PasswordComponent password={password} setPassword={setPassword} />
                </Modal.Content>
                <Modal.Footer>
                    <FooterComponent password={password} />
                </Modal.Footer>
            </Modal>
        );
    }
    return (
        <Dialog>
            <Dialog.Header />
            <Dialog.Content>
                <PasswordComponent password={password} setPassword={setPassword} />
            </Dialog.Content>
        </Dialog>
    );
};

export default DxtradePasswordModal;
