import React, { ComponentProps, useCallback, useState } from 'react';
import { Modal } from '@/components';
import { useCFDContext } from '@/providers';
import { JurisdictionModal } from '@cfd/modals';
import { MT5AccountType } from '@cfd/screens';
import { Button } from '@deriv-com/ui';

type TMarketTypes = ComponentProps<typeof MT5AccountType>['selectedMarketType'];

const MT5AccountTypeModal = () => {
    const [selectedMarketType, setSelectedMarketType] = useState<TMarketTypes>(undefined);
    const { setCfdState } = useCFDContext();
    const [isJurisdictionModalOpen, setIsJurisdictionModalOpen] = useState(false);

    const handleOnClose = useCallback(() => {
        setIsJurisdictionModalOpen(false);
    }, [setIsJurisdictionModalOpen]);

    return (
        <>
            <Modal>
                <Modal.Header title='Select Deriv MT5’s account type' />
                <Modal.Content>
                    <MT5AccountType
                        onMarketTypeSelect={setSelectedMarketType}
                        selectedMarketType={selectedMarketType}
                    />
                </Modal.Content>
                <Modal.Footer>
                    <Button
                        className='h-40 rounded-xs'
                        disabled={!selectedMarketType}
                        onClick={() => {
                            setCfdState('marketType', selectedMarketType);
                            setIsJurisdictionModalOpen(true);
                        }}
                    >
                        Next
                    </Button>
                </Modal.Footer>
            </Modal>
            <JurisdictionModal isOpen={isJurisdictionModalOpen} onClose={handleOnClose} />
        </>
    );
};

export default MT5AccountTypeModal;
