import React, { useState } from 'react';
import { Dialog, Modal } from '@/components';
import { Category, PlatformDetails } from '@cfd/constants';
import { useActiveTradingAccount, useMT5AccountsList } from '@deriv/api';
import { useDevice } from '@deriv-com/ui';
import MT5PasswordFooter from './MT5PasswordFooter';
import MT5PasswordInput from './MT5PasswordInput';

const MT5PasswordModal = () => {
    const [password, setPassword] = useState('');
    const { data: activeTrading } = useActiveTradingAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { isDesktop } = useDevice();

    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const isDemo = activeTrading?.is_virtual;

    const ModalHeaderTitle = `${hasMT5Account ? 'Add' : 'Create'} a ${isDemo ? Category.DEMO : Category.REAL} ${
        PlatformDetails.mt5.title
    } account`;

    if (!isDesktop) {
        return (
            <Modal>
                <Modal.Header title={ModalHeaderTitle} />
                <Modal.Content>
                    <MT5PasswordInput password={password} setPassword={setPassword} />
                </Modal.Content>
                <Modal.Footer>
                    <MT5PasswordFooter password={password} />
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <Dialog>
            <Dialog.Header />
            <Dialog.Content>
                <MT5PasswordInput password={password} setPassword={setPassword} />
            </Dialog.Content>
        </Dialog>
    );
};

export default MT5PasswordModal;
