import React from 'react';
import useDevice from '../../../../../../../../hooks/useDevice';
import { WalletClipboard, WalletText } from '../../../../../../../../components';
import './WithdrawalCryptoDestinationAddress.scss';

const WithdrawalCryptoDestinationAddress: React.FC<{ address?: string }> = ({ address }) => {
    const { isMobile } = useDevice();
    return (
        <div className='wallets-withdrawal-crypto-destination-address'>
            <div className='wallets-withdrawal-crypto-destination-address__title'>
                <WalletText color='less-prominent' size='2xs'>
                    Destination address
                </WalletText>
            </div>
            <div className='wallets-withdrawal-crypto-destination-address__content'>
                <WalletText size='sm' weight='bold'>
                    {address}
                </WalletText>
                <WalletClipboard
                    infoMessage={isMobile ? undefined : 'copy'}
                    popoverAlignment={isMobile ? 'left' : 'bottom'}
                    successMessage='copied'
                    textCopy={address ?? ''}
                />
            </div>
        </div>
    );
};

export default WithdrawalCryptoDestinationAddress;
