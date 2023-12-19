import React, { ComponentProps, useState } from 'react';
import { Button } from '@deriv/quill-design';
import { ModalStepWrapper } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import { MT5AccountType } from '../../screens';

type TMarketTypes = ComponentProps<typeof MT5AccountType>['selectedMarketType'];

const MT5AccountTypeModal = () => {
    const [selectedMarketType, setSelectedMarketType] = useState<TMarketTypes>(undefined);
    const { setModalState } = useModal();

    return (
        <ModalStepWrapper
            renderFooter={() => (
                <Button
                    colorStyle='coral'
                    disabled={!selectedMarketType}
                    onClick={() => {
                        setModalState('marketType', selectedMarketType);
                    }}
                    size='md'
                    variant='primary'
                >
                    Next
                </Button>
            )}
            title='Select Deriv MT5’s account type'
        >
            <MT5AccountType onMarketTypeSelect={setSelectedMarketType} selectedMarketType={selectedMarketType} />
        </ModalStepWrapper>
    );
};

export default MT5AccountTypeModal;
