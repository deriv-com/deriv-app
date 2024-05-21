import React from 'react';
import QRCode from 'qrcode.react';
import { WalletsDepositCryptoAddressLoader } from '../../../../../../components';
import { WalletClipboard, WalletText } from '../../../../../../components/Base';
import useDevice from '../../../../../../hooks/useDevice';
import './DepositCryptoAddress.scss';

type TProps = {
    depositCryptoAddress?: string;
    isLoading: boolean;
};

const DepositCryptoAddress: React.FC<TProps> = ({ depositCryptoAddress, isLoading }) => {
    const { isMobile } = useDevice();

    if (isLoading)
        return (
            <div className='wallets-deposit-crypto-address__loader' data-testid='dt_deposit-crypto-address-loader'>
                <WalletsDepositCryptoAddressLoader />
            </div>
        );

    return (
        <div className='wallets-deposit-crypto-address'>
            <QRCode data-testid='dt_deposit-crypto-address-qr-code' size={128} value={depositCryptoAddress || ''} />
            <div className='wallets-deposit-crypto-address__hash'>
                <div className='wallets-deposit-crypto-address__hash-text'>
                    <WalletText size='sm' weight='bold'>
                        {depositCryptoAddress}
                    </WalletText>
                </div>
                <div className='wallets-deposit-crypto-address__hash-clipboard'>
                    <WalletClipboard
                        infoMessage={isMobile ? undefined : 'copy'}
                        popoverAlignment={isMobile ? 'left' : 'bottom'}
                        successMessage='copied'
                        textCopy={depositCryptoAddress || ''}
                    />
                </div>
            </div>
        </div>
    );
};

export default DepositCryptoAddress;
