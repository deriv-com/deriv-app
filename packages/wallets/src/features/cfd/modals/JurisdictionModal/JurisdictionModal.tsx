import React, { useCallback, useEffect, useState } from 'react';
import { useAvailableMT5Accounts } from '@deriv/api';
import { ModalStepWrapper, WalletButton } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { DynamicLeverageContext } from '../../components/DynamicLeverageContext';
import { MarketTypeDetails } from '../../constants';
import { Verification } from '../../flows/Verification';
import { DynamicLeverageScreen, DynamicLeverageTitle } from '../../screens/DynamicLeverage';
import { JurisdictionScreen } from '../../screens/Jurisdiction';
import { MT5PasswordModal } from '..';
import './JurisdictionModal.scss';

const JurisdictionModal = () => {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
    const [isDynamicLeverageVisible, setIsDynamicLeverageVisible] = useState(false);
    const [isCheckBoxChecked, setIsCheckBoxChecked] = useState(false);

    const { getModalState, setModalState, show } = useModal();
    const { isLoading } = useAvailableMT5Accounts();
    const { isMobile } = useDevice();

    const marketType = getModalState('marketType') || 'all';
    const platform = getModalState('platform') || 'mt5';

    const { title } = MarketTypeDetails[marketType];

    const toggleDynamicLeverage = useCallback(() => {
        setIsDynamicLeverageVisible(!isDynamicLeverageVisible);
    }, [isDynamicLeverageVisible, setIsDynamicLeverageVisible]);

    const jurisdictionTitle = `Choose a jurisdiction for your Deriv MT5 ${title} account`;

    const JurisdictionFlow = () => {
        if (selectedJurisdiction === 'svg') {
            return <MT5PasswordModal marketType={marketType} platform={platform} />;
        }

        return <Verification selectedJurisdiction={selectedJurisdiction} />;
    };

    const modalFooter = isDynamicLeverageVisible
        ? undefined
        : () => (
              <WalletButton
                  disabled={!selectedJurisdiction || (selectedJurisdiction !== 'svg' && !isCheckBoxChecked)}
                  isFullWidth={isMobile}
                  onClick={() => show(<JurisdictionFlow />)}
                  text='Next'
              />
          );

    useEffect(() => {
        setModalState('selectedJurisdiction', selectedJurisdiction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedJurisdiction]);

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <DynamicLeverageContext.Provider value={{ isDynamicLeverageVisible, toggleDynamicLeverage }}>
            <ModalStepWrapper
                renderFooter={modalFooter}
                shouldHideHeader={isDynamicLeverageVisible}
                title={jurisdictionTitle}
            >
                {isDynamicLeverageVisible && <DynamicLeverageTitle />}
                <div className='wallets-jurisdiction-modal'>
                    <JurisdictionScreen
                        isCheckBoxChecked={isCheckBoxChecked}
                        selectedJurisdiction={selectedJurisdiction}
                        setIsCheckBoxChecked={setIsCheckBoxChecked}
                        setSelectedJurisdiction={setSelectedJurisdiction}
                    />
                    <DynamicLeverageScreen />
                </div>
            </ModalStepWrapper>
        </DynamicLeverageContext.Provider>
    );
};

export default JurisdictionModal;
