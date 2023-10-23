import React, { useCallback, useState } from 'react';
import { useAvailableMT5Accounts } from '@deriv/api';
import { ModalStepWrapper, WalletButton } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import { DynamicLeverageContext } from '../../components/DynamicLeverageContext';
import { DynamicLeverageScreen, DynamicLeverageTitle } from '../../screens/DynamicLeverage';
import { JurisdictionScreen } from '../../screens/Jurisdiction';
import { MT5PasswordModal } from '..';
import './JurisdictionModal.scss';

const marketTypeToTitleMapper = {
    all: 'Swap-Free',
    financial: 'Financial',
    synthetic: 'Derived',
};

const JurisdictionModal = () => {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
    const [isDynamicLeverageVisible, setIsDynamicLeverageVisible] = useState(false);

    const { modalState, show } = useModal();
    const { isLoading } = useAvailableMT5Accounts();

    const marketType = modalState?.marketType || 'all';
    const platform = modalState?.platform || 'mt5';

    const capitalizedMarketType = marketTypeToTitleMapper[marketType];

    const toggleDynamicLeverage = useCallback(() => {
        setIsDynamicLeverageVisible(!isDynamicLeverageVisible);
    }, [isDynamicLeverageVisible, setIsDynamicLeverageVisible]);

    const jurisdictionTitle = `Choose a jurisdiction for your Deriv MT5 ${capitalizedMarketType} account`;

    const modalFooter = isDynamicLeverageVisible
        ? undefined
        : () => (
              <WalletButton
                  disabled={!selectedJurisdiction}
                  onClick={() => show(<MT5PasswordModal marketType={marketType} platform={platform} />)}
                  text='Next'
              />
          );

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <DynamicLeverageContext.Provider value={{ isDynamicLeverageVisible, toggleDynamicLeverage }}>
            <ModalStepWrapper
                renderFooter={modalFooter}
                title={isDynamicLeverageVisible ? <DynamicLeverageTitle /> : jurisdictionTitle}
            >
                <div className='wallets-jurisdiction-modal'>
                    <JurisdictionScreen
                        selectedJurisdiction={selectedJurisdiction}
                        setSelectedJurisdiction={setSelectedJurisdiction}
                    />
                    <DynamicLeverageScreen />
                </div>
            </ModalStepWrapper>
        </DynamicLeverageContext.Provider>
    );
};

export default JurisdictionModal;
