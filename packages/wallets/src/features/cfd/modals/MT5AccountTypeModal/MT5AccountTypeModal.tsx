import React, { useState } from 'react';
import { ModalStepWrapper, WalletButton, WalletText } from '../../../../components/Base';
import { JurisdictionModal } from '../../../../components/JurisdictionModal';
import { useModal } from '../../../../components/ModalProvider';
import { MT5AccountType } from '../../screens';

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
                    <WalletText align='center' color='white' size='sm' weight='bold'>
                        Get
                    </WalletText>
                </WalletButton>
            )}
            title='Select Deriv MT5’s account type'
        >
            <MT5AccountType onMarketTypeSelect={setSelectedMarketType} selectedMarketType={selectedMarketType} />
        </ModalStepWrapper>
    );
};

export default MT5AccountTypeModal;
