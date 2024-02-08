import React, { useState } from 'react';
import { Dialog, Modal } from '@/components';
import { useBreakpoint } from '@deriv/quill-design';
import DxtradePasswordFooter from './DxtradePasswordFooter';
import DxtradePasswordInput from './DxtradePasswordInput';

const DxtradePasswordModal = () => {
    const { isMobile } = useBreakpoint();
    const [password, setPassword] = useState('');

    if (isMobile) {
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
