import React, { ComponentProps, useState } from 'react';
import { Modal } from '@/components';
import { JurisdictionModal } from '@cfd/modals';
import { MT5AccountType } from '@cfd/screens';
import { Provider } from '@deriv/library';
import { Button } from '@deriv-com/ui';

type TMarketTypes = ComponentProps<typeof MT5AccountType>['selectedMarketType'];

const MT5AccountTypeModal = () => {
    const [selectedMarketType, setSelectedMarketType] = useState<TMarketTypes>(undefined);
    const { setCfdState } = Provider.useCFDContext();
    const { show } = Provider.useModal();

    return (
        <Modal>
            <Modal.Header title='Select Deriv MT5’s account type' />
            <Modal.Content>
                <MT5AccountType onMarketTypeSelect={setSelectedMarketType} selectedMarketType={selectedMarketType} />
            </Modal.Content>
            <Modal.Footer>
                <Button
                    className='h-40 rounded-xs'
                    disabled={!selectedMarketType}
                    onClick={() => {
                        setCfdState('marketType', selectedMarketType);
                        show(<JurisdictionModal />);
                    }}
                >
                    Next
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MT5AccountTypeModal;
