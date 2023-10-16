import React, { useState } from 'react';
import { useAvailableMT5Accounts } from '@deriv/api';
import { ModalStepWrapper, WalletButton, WalletText } from '../../../../components/Base';
// import { WalletText } from '../../../../components/Base/WalletText';
import { useModal } from '../../../../components/ModalProvider';
import { JurisdictionScreen } from '../../screens/JurisdictionScreen';
import { MT5PasswordModal } from '..';

const JurisdictionModal = () => {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
    const { modalState, show } = useModal();
    const { isLoading } = useAvailableMT5Accounts();

    const marketType = modalState?.marketType || 'all';

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <ModalStepWrapper
            renderFooter={() => (
                <React.Fragment>
                    <WalletButton
                        disabled={!selectedJurisdiction}
                        onClick={() => show(<MT5PasswordModal marketType={marketType} />)}
                    >
                        <WalletText color='white' size='xs' weight='bold'>
                            Next
                        </WalletText>
                    </WalletButton>
                </React.Fragment>
            )}
            title='Choose a jurisdiction for your MT5 Derived account'
        >
            <JurisdictionScreen
                selectedJurisdiction={selectedJurisdiction}
                setSelectedJurisdiction={setSelectedJurisdiction}
            />
        </ModalStepWrapper>
    );
};

export default JurisdictionModal;
