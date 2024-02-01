import React, { ComponentProps, useState } from 'react';
import { Provider } from '@deriv/library';
import { Button } from '@deriv-com/ui';
import { Modal } from '../../../../components';
import { MT5AccountType } from '../../screens';
import { JurisdictionModal } from '../JurisdictionModal';

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
                    disabled={!selectedMarketType}
                    onClick={() => {
                        setCfdState('marketType', selectedMarketType);
                        show(<JurisdictionModal />);
                    }}
                    size='md'
                >
                    Next
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MT5AccountTypeModal;
