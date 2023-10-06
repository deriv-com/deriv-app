import React, { useState } from 'react';
import { MT5AccountType } from '../ExternalTradingPlatforms/MT5AccountType';
import { JurisdictionModal } from '../JurisdictionModal';
import { useModal } from '../ModalProvider';
import { ModalStepWrapper } from '../ModalStepWrapper';
import { PrimaryActionButton } from '../PrimaryActionButton';

type TMarketTypes = React.ComponentProps<typeof MT5AccountType>['selectedMarketType'];

const MT5AccountTypeModal = () => {
    const [selectedMarketType, setSelectedMarketType] = useState<TMarketTypes>(undefined);
    const { setModalState, show } = useModal();

    return (
        <ModalStepWrapper
            renderFooter={() => (
                <PrimaryActionButton
                    disabled={!selectedMarketType}
                    onClick={() => {
                        setModalState({
                            marketType: selectedMarketType,
                        });
                        show(<JurisdictionModal />);
                    }}
                >
                    <p className='wallets-get-more-mt5-accounts-text'>Next</p>
                </PrimaryActionButton>
            )}
            title='Select Deriv MT5’s account type'
        >
            <MT5AccountType onMarketTypeSelect={setSelectedMarketType} selectedMarketType={selectedMarketType} />
        </ModalStepWrapper>
    );
};

export default MT5AccountTypeModal;
