import React, { ComponentProps, useState } from 'react';
import { useQueryParams } from '@/hooks';
import { useCFDContext } from '@/providers';
import { MT5AccountType } from '@cfd/screens';
import { Button, Modal, Text } from '@deriv-com/ui';

type TMarketTypes = ComponentProps<typeof MT5AccountType>['selectedMarketType'];

const MT5AccountTypeModal = () => {
    const [selectedMarketType, setSelectedMarketType] = useState<TMarketTypes>(undefined);
    const { setCfdState } = useCFDContext();
    const { openModal, isModalOpen, closeModal } = useQueryParams();

    return (
        <Modal ariaHideApp={false} isOpen={isModalOpen('MT5AccountTypeModal')} onRequestClose={closeModal}>
            <Modal.Header onRequestClose={closeModal}>
                <Text weight='bold'>Select Deriv MT5’s account type</Text>
            </Modal.Header>
            <Modal.Body>
                <MT5AccountType onMarketTypeSelect={setSelectedMarketType} selectedMarketType={selectedMarketType} />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='rounded-xs'
                    disabled={!selectedMarketType}
                    onClick={() => {
                        setCfdState({
                            marketType: selectedMarketType,
                        });
                        openModal('JurisdictionModal');
                    }}
                >
                    Next
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MT5AccountTypeModal;
