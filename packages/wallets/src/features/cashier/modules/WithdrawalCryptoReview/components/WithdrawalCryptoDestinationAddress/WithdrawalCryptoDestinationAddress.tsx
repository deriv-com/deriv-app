import React from 'react';
import useDevice from '../../../../../../hooks/useDevice';
import { WalletClipboard, WalletText } from '../../../../../../components';
import './WithdrawalCryptoDestinationAddress.scss';

const WithdrawalCryptoDestinationAddress = () => {
    const { isMobile } = useDevice();
    return (
        <div className='wallets-withdrawal-crypto-destination-address'>
            <WalletText weight='bold'>1FfmbHfnpaZjKFvyi1okTjJJusN455paPH</WalletText>
            <WalletClipboard
                infoMessage={isMobile ? undefined : 'copy'}
                popoverAlignment={isMobile ? 'left' : 'bottom'}
                successMessage='copied'
                textCopy={''}
            />
        </div>
    );
};

export default WithdrawalCryptoDestinationAddress;
