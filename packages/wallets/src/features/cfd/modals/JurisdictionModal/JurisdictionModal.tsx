import React, { useState } from 'react';
import { useAvailableMT5Accounts } from '@deriv/api';
import { ModalStepWrapper, WalletButton } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import { JurisdictionScreen } from '../../screens/Jurisdiction';
import { MT5PasswordModal } from '..';

const marketTypeToTitleMapper = {
    all: 'Swap-Free',
    financial: 'Financial',
    synthetic: 'Derived',
};

const JurisdictionModal = () => {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
    const { modalState, show } = useModal();
    const { isLoading } = useAvailableMT5Accounts();

    const marketType = modalState?.marketType || 'all';
    const platform = modalState?.platform || 'mt5';

    const capitalizedMarketType = marketTypeToTitleMapper[marketType];

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <ModalStepWrapper
            renderFooter={() => (
                <WalletButton
                    disabled={!selectedJurisdiction}
                    onClick={() => show(<MT5PasswordModal marketType={marketType} platform={platform} />)}
                    text='Next'
                />
            )}
            title={`Choose a jurisdiction for your Deriv MT5 ${capitalizedMarketType} account`}
        >
            <JurisdictionScreen
                selectedJurisdiction={selectedJurisdiction}
                setSelectedJurisdiction={setSelectedJurisdiction}
            />
        </ModalStepWrapper>
    );
};

export default JurisdictionModal;
