import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useQueryParams, useRegulationFlags } from '@/hooks';
import { useCFDContext, useModal } from '@/providers';
import { THooks } from '@/types';
import { DummyComponent, DynamicLeverageContext } from '@cfd/components';
import { Jurisdiction, MarketType, MarketTypeDetails } from '@cfd/constants';
import { MT5PasswordModal } from '@cfd/modals';
import { DynamicLeverageScreen, DynamicLeverageTitle, JurisdictionScreen, JurisdictionTncSection } from '@cfd/screens';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';

type TJurisdictionFlowProps = { selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'] };

const JurisdictionFlow = ({ selectedJurisdiction }: TJurisdictionFlowProps) => {
    if (selectedJurisdiction === Jurisdiction.SVG) {
        return <MT5PasswordModal />;
    }

    return <DummyComponent />; // Verification flow
};

const JurisdictionModal = () => {
    const [isDynamicLeverageVisible, setIsDynamicLeverageVisible] = useState(false);
    const [isCheckBoxChecked, setIsCheckBoxChecked] = useState(false);
    const { isOpen, closeModal } = useQueryParams();
    const { show } = useModal();
    const { isEU } = useRegulationFlags();
    const { cfdState, setCfdState } = useCFDContext();

    const { isDesktop } = useDevice();

    const { marketType: marketTypeState, selectedJurisdiction } = cfdState;

    const marketType = marketTypeState ?? MarketType.ALL;

    const { title } = MarketTypeDetails(isEU)[marketType];

    const toggleDynamicLeverage = useCallback(() => {
        setIsDynamicLeverageVisible(!isDynamicLeverageVisible);
    }, [isDynamicLeverageVisible, setIsDynamicLeverageVisible]);

    const jurisdictionTitle = `Choose a jurisdiction for your Deriv MT5 ${title} account`;

    const value = useMemo(
        () => ({ isDynamicLeverageVisible, toggleDynamicLeverage }),
        [isDynamicLeverageVisible, toggleDynamicLeverage]
    );

    useEffect(() => {
        setCfdState({ selectedJurisdiction });
    }, [selectedJurisdiction, setCfdState]);

    const isModalOpen = isOpen('JurisdictionModal');

    return (
        <DynamicLeverageContext.Provider value={value}>
            <Modal
                ariaHideApp={false}
                className='w-screen h-screen lg:w-auto lg:h-auto bg-system-light-primary-background '
                isOpen={isModalOpen}
                onRequestClose={closeModal}
            >
                {!isDynamicLeverageVisible ? (
                    <Modal.Header onRequestClose={closeModal}>
                        <Text weight='bold'>{jurisdictionTitle}</Text>
                    </Modal.Header>
                ) : (
                    <DynamicLeverageTitle />
                )}
                <Modal.Body
                    className={twMerge(
                        'p-0 flex flex-col relative min-h-0 overflow-auto w-screen h-screen lg:w-auto lg:h-auto lg:p-8 lg:min-w-[1100px]',
                        isDynamicLeverageVisible && 'lg:min-h-[700px]'
                    )}
                >
                    <JurisdictionScreen setIsCheckBoxChecked={setIsCheckBoxChecked} />
                    {isDynamicLeverageVisible && <DynamicLeverageScreen />}
                    {!isDynamicLeverageVisible && (
                        <JurisdictionTncSection
                            isCheckBoxChecked={isCheckBoxChecked}
                            setIsCheckBoxChecked={setIsCheckBoxChecked}
                        />
                    )}
                </Modal.Body>
                {!isDynamicLeverageVisible ? (
                    <Modal.Footer className='lg:rounded-default'>
                        <Button
                            className='rounded-xs'
                            disabled={
                                !selectedJurisdiction ||
                                (selectedJurisdiction !== Jurisdiction.SVG && !isCheckBoxChecked)
                            }
                            isFullWidth={!isDesktop}
                            onClick={() => show(<JurisdictionFlow selectedJurisdiction={selectedJurisdiction} />)}
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
