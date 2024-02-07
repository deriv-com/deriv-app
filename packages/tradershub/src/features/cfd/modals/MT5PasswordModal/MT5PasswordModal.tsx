import React, { useState } from 'react';
import { useActiveTradingAccount, useMT5AccountsList } from '@deriv/api';
import { useBreakpoint } from '@deriv/quill-design';
import { Dialog, Modal } from '../../../../components';
import { Category, PlatformDetails } from '../../constants';
import MT5PasswordFooter from './MT5PasswordFooter';
import MT5PasswordInput from './MT5PasswordInput';

const MT5PasswordModal = () => {
    const [password, setPassword] = useState('');
    const { data: activeTrading } = useActiveTradingAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { isMobile } = useBreakpoint();

    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const isDemo = activeTrading?.is_virtual;

    const ModalHeaderTitle = `${hasMT5Account ? 'Add' : 'Create'} a ${isDemo ? Category.DEMO : Category.REAL} ${
        PlatformDetails.mt5.title
    } account`;

    if (isMobile) {
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
