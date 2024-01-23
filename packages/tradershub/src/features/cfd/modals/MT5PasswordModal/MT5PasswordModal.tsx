import React, { useState } from 'react';
import { useActiveTradingAccount, useCreateMT5Account, useMT5AccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { useBreakpoint } from '@deriv/quill-design';
import { ActionScreen, Dialog, Modal } from '../../../../components';
import { Category, PlatformDetails, QueryStatus } from '../../constants';
import FooterComponent from './FooterComponent';
import PasswordComponent from './PasswordComponent';
import SuccessComponent from './SuccessComponent';

const MT5PasswordModal = () => {
    const [password, setPassword] = useState('');
    const { error, status } = useCreateMT5Account();
    const { data: activeTrading } = useActiveTradingAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { getCFDState } = Provider.useCFDContext();
    const isSuccess = getCFDState('isSuccess');

    const { isMobile } = useBreakpoint();

    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const isDemo = activeTrading?.is_virtual;

    const ModalHeaderTitle = `${hasMT5Account ? 'Add' : 'Create'} a ${isDemo ? Category.DEMO : Category.REAL} ${
        PlatformDetails.mt5.title
    } account`;

    if (status === QueryStatus.ERROR && error?.error?.code !== 'PasswordError') {
        return <ActionScreen description={error?.error.message} title={error?.error?.code} />;
    }

    if (isMobile) {
        return (
            <Modal>
                <Modal.Header title={isSuccess ? '' : ModalHeaderTitle} />
                <Modal.Content>
                    <SuccessComponent />
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
                <SuccessComponent />
                <PasswordComponent password={password} setPassword={setPassword} />
            </Dialog.Content>
        </Dialog>
    );
};

export default MT5PasswordModal;
