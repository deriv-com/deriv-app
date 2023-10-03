import React, { useState } from 'react';
import { MT5AccountType } from '../ExternalTradingPlatforms/MT5AccountType';
import { JurisdictionModal } from '../JurisdictionModal';
import { useModal } from '../ModalProvider';
import { ModalStepWrapper } from '../ModalStepWrapper';
import './MT5AccountTypeModal.scss';

type TMarketTypes = React.ComponentProps<typeof MT5AccountType>['selectedMarketType'];

const MT5AccountTypeModal = () => {
    const [selectedMarketType, setSelectedMarketType] = useState<TMarketTypes>(undefined);
    const { show } = useModal();

    return (
        <ModalStepWrapper
            renderFooter={() => (
                <button
                    className={`wallets-mt5-account-type-modal-next-button${!selectedMarketType ? '-disabled' : ''}`}
                    onClick={() => {
                        show(<JurisdictionModal />);
                    }}
                >
                    <p className='wallets-mt5-account-type-modal-text'>Next</p>
                </button>
            )}
            title='Select Deriv MT5’s account type'
        >
            <MT5AccountType onMarketTypeSelect={setSelectedMarketType} selectedMarketType={selectedMarketType} />
        </ModalStepWrapper>
    );
};

export default MT5AccountTypeModal;
