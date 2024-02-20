import React, { useState } from 'react';
import { Dialog, Modal } from '@/components';
import { useDevice } from '@deriv-com/ui';
import DxtradePasswordFooter from './DxtradePasswordFooter';
import DxtradePasswordInput from './DxtradePasswordInput';

const DxtradePasswordModal = () => {
    const { isDesktop } = useDevice();
    const [password, setPassword] = useState('');

    if (!isDesktop) {
        return (
            <Modal>
                <Modal.Content>
                    <DxtradePasswordInput password={password} setPassword={setPassword} />
                </Modal.Content>
                <Modal.Footer>
                    <DxtradePasswordFooter password={password} />
                </Modal.Footer>
            </Modal>
        );
    }
    return (
        <Dialog>
            <Dialog.Header />
            <Dialog.Content>
                <DxtradePasswordInput password={password} setPassword={setPassword} />
            </Dialog.Content>
        </Dialog>
    );
};

export default DxtradePasswordModal;
