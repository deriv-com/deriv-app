import React, { useState } from 'react';
import { useActiveTradingAccount, useMT5AccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { useBreakpoint } from '@deriv/quill-design';
import { ActionScreen, Dialog, Modal } from '../../../../components';
import useMT5AccountHandler from '../../../../hooks/useMT5AccountHandler';
import { Category, PlatformDetails, QueryStatus } from '../../constants';
import FooterComponent from './FooterComponent';
import PasswordComponent from './PasswordComponent';
import SuccessComponent from './SuccessComponent';

const MT5PasswordModal = () => {
    const [password, setPassword] = useState('');
    const { data: activeTrading } = useActiveTradingAccount();
    const { data: mt5Accounts } = useMT5AccountsList();

    const { getCFDState } = Provider.useCFDContext();
    const marketType = getCFDState('marketType') ?? 'all';
    const selectedJurisdiction = getCFDState('selectedJurisdiction') ?? 'maltainvest';
    const { isCreateMT5AccountError, isCreateMT5AccountSuccess } = useMT5AccountHandler({
        marketType,
        selectedJurisdiction,
    });

    const { isMobile } = useBreakpoint();

    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const isDemo = activeTrading?.is_virtual;

    const ModalHeaderTitle = `${hasMT5Account ? 'Add' : 'Create'} a ${isDemo ? Category.DEMO : Category.REAL} ${
        PlatformDetails.mt5.title
    } account`;

    if (status === QueryStatus.ERROR && isCreateMT5AccountError?.error?.code !== 'PasswordError') {
        return (
            <ActionScreen
                description={isCreateMT5AccountError?.error.message}
                title={isCreateMT5AccountError?.error?.code}
            />
        );
    }

    if (isMobile) {
        return (
            <Modal>
                <Modal.Header title={isCreateMT5AccountSuccess ? '' : ModalHeaderTitle} />
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
