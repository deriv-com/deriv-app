import React, { useState } from 'react';
import { useActiveTradingAccount, useCreateMT5Account, useMT5AccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { useBreakpoint } from '@deriv/quill-design';
import { ActionScreen, Dialog, Modal } from '../../../../components';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { Category, PlatformDetails, QueryStatus } from '../../constants';
import FooterComponent from './FooterComponent';
import PasswordComponent from './PasswordComponent';
import SuccessComponent from './SuccessComponent';

type TMT5PasswordModalProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
};

const MT5PasswordModal = ({ marketType, platform }: TMT5PasswordModalProps) => {
    const [password, setPassword] = useState('');
    const { error, isSuccess, status } = useCreateMT5Account();
    const { data: activeTrading } = useActiveTradingAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { getCFDState } = Provider.useCFDContext();
    const { isMobile } = useBreakpoint();

    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const isDemo = activeTrading?.is_virtual;
    const selectedJurisdiction = getCFDState('selectedJurisdiction') ?? '';

    const ModalHeaderTitle = () => {
        if (isSuccess) {
            return ' ';
        }
        return `${hasMT5Account ? 'Add' : 'Create'} a ${isDemo ? Category.DEMO : Category.REAL} ${
            PlatformDetails.mt5.title
        } account`;
    };

    if (status === QueryStatus.ERROR && error?.error?.code !== 'PasswordError') {
        return <ActionScreen description={error?.error.message} title={error?.error?.code} />;
    }

    if (isMobile) {
        return (
            <Modal>
                <Modal.Header title={ModalHeaderTitle()} />
                <Modal.Content>
                    <SuccessComponent
                        marketType={marketType}
                        platform={platform}
                        selectedJurisdiction={selectedJurisdiction}
                    />
                    <PasswordComponent
                        marketType={marketType}
                        password={password}
                        platform={platform}
                        selectedJurisdiction={selectedJurisdiction}
                        setPassword={setPassword}
                    />
                </Modal.Content>
                <Modal.Footer>
                    <FooterComponent
                        marketType={marketType}
                        password={password}
                        platform={platform}
                        selectedJurisdiction={selectedJurisdiction}
                    />
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <Dialog>
            <Dialog.Header />
            <Dialog.Content>
                <SuccessComponent
                    marketType={marketType}
                    platform={platform}
                    selectedJurisdiction={selectedJurisdiction}
                />
                <PasswordComponent
                    marketType={marketType}
                    password={password}
                    platform={platform}
                    selectedJurisdiction={selectedJurisdiction}
                    setPassword={setPassword}
                />
            </Dialog.Content>
        </Dialog>
    );
};

export default MT5PasswordModal;
