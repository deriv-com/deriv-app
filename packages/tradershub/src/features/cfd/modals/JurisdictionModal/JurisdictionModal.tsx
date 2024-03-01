import React, { memo, useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useRegulationFlags } from '@/hooks';
import { useCFDContext, useModal } from '@/providers';
import { DummyComponent, DynamicLeverageContext } from '@cfd/components';
import { Jurisdiction, MarketType, MarketTypeDetails } from '@cfd/constants';
import { MT5PasswordModal } from '@cfd/modals';
import { DynamicLeverageScreen, DynamicLeverageTitle, JurisdictionScreen } from '@cfd/screens';
import { useAvailableMT5Accounts } from '@deriv/api';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import { JurisdictionTncSection } from '../../screens/Jurisdiction/JurisdictionTncSection';

type TJurisdictionModal = {
    isOpen: boolean;
    onClose: () => void;
};

const JurisdictionModal = ({ isOpen, onClose }: TJurisdictionModal) => {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
    const [isDynamicLeverageVisible, setIsDynamicLeverageVisible] = useState(false);
    const [isCheckBoxChecked, setIsCheckBoxChecked] = useState(false);

    const { show } = useModal();
    const { isEU } = useRegulationFlags();
    const { getCFDState, setCfdState } = useCFDContext();

    const { isLoading } = useAvailableMT5Accounts();
    const { isDesktop } = useDevice();

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
    if (isLoading) return <Text weight='bold'>Loading...</Text>;

    return (
        <DynamicLeverageContext.Provider value={{ isDynamicLeverageVisible, toggleDynamicLeverage }}>
            <Modal
                ariaHideApp={false}
                className='w-screen h-screen lg:w-auto lg:h-auto bg-system-light-primary-background '
                isOpen={isOpen}
                onRequestClose={onClose}
            >
                {!isDynamicLeverageVisible ? (
                    <Modal.Header onRequestClose={onClose}>
                        <Text weight='bold'>{jurisdictionTitle}</Text>
                    </Modal.Header>
                ) : null}
                <Modal.Body
                    className={twMerge(
                        `p-0 flex flex-col relative min-h-0 overflow-auto ${
                            marketType === MarketType.FINANCIAL
                                ? 'lg:w-[1200px] lg:h-[650px]'
                                : 'lg:w-[1040px] lg:h-[592px]'
                        } `
                    )}
                >
                    {isDynamicLeverageVisible && <DynamicLeverageTitle />}
                    <JurisdictionScreen
                        isCheckBoxChecked={isCheckBoxChecked}
                        selectedJurisdiction={selectedJurisdiction}
                        setIsCheckBoxChecked={setIsCheckBoxChecked}
                        setSelectedJurisdiction={setSelectedJurisdiction}
                    />
                    {isDynamicLeverageVisible && <DynamicLeverageScreen />}

                    <JurisdictionTncSection
                        isCheckBoxChecked={isCheckBoxChecked}
                        selectedJurisdiction={selectedJurisdiction}
                        setIsCheckBoxChecked={setIsCheckBoxChecked}
                    />
                </Modal.Body>
                {!isDynamicLeverageVisible ? (
                    <Modal.Footer className='bg-white sm:w-full lg:rounded-default'>
                        <Button
                            className='h-40 rounded-xs'
                            disabled={
                                !selectedJurisdiction ||
                                (selectedJurisdiction !== Jurisdiction.SVG && !isCheckBoxChecked)
                            }
                            isFullWidth={!isDesktop}
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

export default memo(JurisdictionModal);
