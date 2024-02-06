import React, { useCallback, useEffect, useState } from 'react';
import { Modal, useUIContext } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { DummyComponent, DynamicLeverageContext } from '@cfd/components';
import { Jurisdiction, MarketType, MarketTypeDetails } from '@cfd/constants';
import { MT5PasswordModal } from '@cfd/modals';
import { DynamicLeverageScreen, DynamicLeverageTitle, JurisdictionScreen } from '@cfd/screens';
import { useAvailableMT5Accounts } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Heading, useBreakpoint } from '@deriv/quill-design';
import { Button } from '@deriv-com/ui';

const JurisdictionModal = () => {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
    const [isDynamicLeverageVisible, setIsDynamicLeverageVisible] = useState(false);
    const [isCheckBoxChecked, setIsCheckBoxChecked] = useState(false);

    const { show } = Provider.useModal();
    const { uiState } = useUIContext();
    const activeRegulation = uiState.regulation;
    const { isEU } = useRegulationFlags(activeRegulation);
    const { getCFDState, setCfdState } = Provider.useCFDContext();

    const { isLoading } = useAvailableMT5Accounts();
    const { isMobile } = useBreakpoint();

    const marketType = getCFDState('marketType') ?? MarketType.ALL;

    const { title } = MarketTypeDetails(isEU)[marketType];

    const toggleDynamicLeverage = useCallback(() => {
        setIsDynamicLeverageVisible(!isDynamicLeverageVisible);
    }, [isDynamicLeverageVisible, setIsDynamicLeverageVisible]);

    const jurisdictionTitle = `Choose a jurisdiction for your Deriv MT5 ${title} account`;

    const JurisdictionFlow = () => {
        if (selectedJurisdiction === Jurisdiction.SVG) {
            return <MT5PasswordModal />;
        }

        return <DummyComponent />; // Verification flow
    };

    useEffect(() => {
        setCfdState('selectedJurisdiction', selectedJurisdiction);
    }, [selectedJurisdiction, setCfdState]);

    // TODO: Add Loading Placeholder
    if (isLoading) return <Heading.H1>Loading...</Heading.H1>;

    return (
        <DynamicLeverageContext.Provider value={{ isDynamicLeverageVisible, toggleDynamicLeverage }}>
            <Modal className='bg-background-primary-container'>
                {!isDynamicLeverageVisible ? <Modal.Header title={jurisdictionTitle} /> : null}
                <Modal.Content>
                    {isDynamicLeverageVisible && <DynamicLeverageTitle />}
                    <div className='relative [perspective:200rem]'>
                        <JurisdictionScreen
                            isCheckBoxChecked={isCheckBoxChecked}
                            selectedJurisdiction={selectedJurisdiction}
                            setIsCheckBoxChecked={setIsCheckBoxChecked}
                            setSelectedJurisdiction={setSelectedJurisdiction}
                        />
                        <DynamicLeverageScreen />
                    </div>
                </Modal.Content>
                {!isDynamicLeverageVisible ? (
                    <Modal.Footer>
                        <Button
                            className='rounded-200'
                            disabled={
                                !selectedJurisdiction ||
                                (selectedJurisdiction !== Jurisdiction.SVG && !isCheckBoxChecked)
                            }
                            isFullWidth={isMobile}
                            onClick={() => show(<JurisdictionFlow />)}
                        >
                            Next
                        </Button>
                    </Modal.Footer>
                ) : null}
            </Modal>
        </DynamicLeverageContext.Provider>
    );
};

export default JurisdictionModal;
