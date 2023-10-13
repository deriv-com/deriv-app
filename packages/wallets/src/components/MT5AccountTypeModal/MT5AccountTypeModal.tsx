import React, { useState } from 'react';
import { WalletButton } from '../Base';
import { MT5AccountType } from '../ExternalTradingPlatforms/MT5AccountType';
import { JurisdictionModal } from '../JurisdictionModal';
import { useModal } from '../ModalProvider';
import { ModalStepWrapper } from '../ModalStepWrapper';

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
                        setModalState({
                            marketType: selectedMarketType,
                        });
                        show(<JurisdictionModal />);
                    }}
                >
                    Next
                </WalletButton>
            )}
            title='Select Deriv MT5’s account type'
        >
            <MT5AccountType onMarketTypeSelect={setSelectedMarketType} selectedMarketType={selectedMarketType} />
        </ModalStepWrapper>
    );
};

export default MT5AccountTypeModal;
