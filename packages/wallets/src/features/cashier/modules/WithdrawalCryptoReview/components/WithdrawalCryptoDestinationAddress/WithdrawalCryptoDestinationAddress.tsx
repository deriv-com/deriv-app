import React from 'react';
import useDevice from '../../../../../../hooks/useDevice';
import { WalletClipboard, WalletText } from '../../../../../../components';
import './WithdrawalCryptoDestinationAddress.scss';

const WithdrawalCryptoDestinationAddress = () => {
    const { isMobile } = useDevice();
    return (
        <div className='wallets-withdrawal-crypto-destination-address'>
            <div className='wallets-withdrawal-crypto-destination-address__title'>
                <WalletText color='general' size='2xs'>
                    Destination address
                </WalletText>
            </div>
            <div className='wallets-withdrawal-crypto-destination-address__content'>
                <WalletText size='sm' weight='bold'>
                    1FfmbHfnpaZjKFvyi1okTjJJusN455paPH
                </WalletText>
                <WalletClipboard
                    infoMessage={isMobile ? undefined : 'copy'}
                    popoverAlignment={isMobile ? 'left' : 'bottom'}
                    successMessage='copied'
                    textCopy={''}
                />
            </div>
        </div>
    );
};

export default WithdrawalCryptoDestinationAddress;
