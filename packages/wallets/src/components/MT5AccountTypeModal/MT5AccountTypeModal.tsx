import React from 'react';
import { MT5AccountType } from '../ExternalTradingPlatforms/MT5AccountType';
import { PrimaryActionButton } from '../PrimaryActionButton';
import { WalletModal } from '../WalletModal';
import { WideWrapper } from '../WideWrapper';

type TMarketTypes = React.ComponentProps<typeof MT5AccountType>['selectedMarketType'];

const MT5AccountTypeModal = () => {
    const [selectedMarketType, setSelectedMarketType] = React.useState<TMarketTypes>(undefined);

    return (
        <WalletModal>
            <WideWrapper
                renderFooter={() => (
                    <PrimaryActionButton
                        disabled={!selectedMarketType}
                        onClick={() => {
                            //Jurisdiction modal here
                        }}
                    >
                        <p className='wallets-get-more-mt5-accounts-text'>Next</p>
                    </PrimaryActionButton>
                )}
                renderHeader={() => <div>Select Deriv MT5’s account type</div>}
            >
                <MT5AccountType onMarketTypeSelect={setSelectedMarketType} selectedMarketType={selectedMarketType} />
            </WideWrapper>
        </WalletModal>
    );
};

export default MT5AccountTypeModal;
