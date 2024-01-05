import React, { ComponentProps, useState } from 'react';
import { Provider } from '@deriv/library';
import { Button } from '@deriv/quill-design';
import { ModalStepWrapper } from '../../../../components';
import { MT5AccountType } from '../../screens';

type TMarketTypes = ComponentProps<typeof MT5AccountType>['selectedMarketType'];

const MT5AccountTypeModal = () => {
    const [selectedMarketType, setSelectedMarketType] = useState<TMarketTypes>(undefined);
    const { setCfdState } = Provider.useCFDContext();

    return (
        <ModalStepWrapper
            renderFooter={() => (
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
            )}
            title='Select Deriv MT5’s account type'
        >
            <MT5AccountType onMarketTypeSelect={setSelectedMarketType} selectedMarketType={selectedMarketType} />
        </ModalStepWrapper>
    );
};

export default MT5AccountTypeModal;
