import React, { useState } from 'react';
import { ModalStepWrapper, WalletButton } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import { PlatformDetails } from '../../constants';
import { MT5AccountType } from '../../screens';
import { JurisdictionModal } from '../JurisdictionModal';

type TMarketTypes = React.ComponentProps<typeof MT5AccountType>['selectedMarketType'];

const MT5AccountTypeModal = () => {
    const [selectedMarketType, setSelectedMarketType] = useState<TMarketTypes>(undefined);
    const { setModalState, show } = useModal();

    return (
        <ModalStepWrapper
            renderFooter={() => (
                <WalletButton
                    disabled={!selectedMarketType}
                    onClick={() => {
                        setModalState('marketType', selectedMarketType);
                        show(<JurisdictionModal />);
                    }}
                    text='Next'
                />
            )}
            title={`Select ${PlatformDetails?.mt5?.title}’s account type`}
        >
            <MT5AccountType onMarketTypeSelect={setSelectedMarketType} selectedMarketType={selectedMarketType} />
        </ModalStepWrapper>
    );
};

export default MT5AccountTypeModal;
