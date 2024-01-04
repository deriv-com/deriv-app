import React, { ComponentProps, useState } from 'react';
import { Provider } from '@deriv/library';
import { Button } from '@deriv/quill-design';
import { Modal, ModalStepWrapper } from '../../../../components';
import { MT5AccountType } from '../../screens';
import { Modal } from '../../../../components/Modal';

type TMarketTypes = ComponentProps<typeof MT5AccountType>['selectedMarketType'];

const MT5AccountTypeModal = () => {
    const [selectedMarketType, setSelectedMarketType] = useState<TMarketTypes>(undefined);
    const { setCfdState } = Provider.useCFDContext();

    return (
        <Modal>
            <Modal.Header className='text-body-md' title='Select Deriv MT5’s account type' />
            <Modal.Content>
                <MT5AccountType onMarketTypeSelect={setSelectedMarketType} selectedMarketType={selectedMarketType} />
            </Modal.Content>
            <Modal.Footer>
                <Button
                    colorStyle='coral'
                    disabled={!selectedMarketType}
                    onClick={() => {
                        setCfdState('marketType', selectedMarketType);
                    }}
                    size='md'
                    variant='primary'
                >
                    Next
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MT5AccountTypeModal;
