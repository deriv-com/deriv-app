import React from 'react';
import { WalletClipboard, WalletText } from '../../../../../../../../components';
import './WithdrawalCryptoDestinationAddress.scss';

const WithdrawalCryptoDestinationAddress: React.FC<{ address?: string }> = ({ address }) => {
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
                <WalletClipboard textCopy={address ?? ''} />
            </div>
        </div>
    );
};

export default WithdrawalCryptoDestinationAddress;
