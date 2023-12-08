import React, { useEffect } from 'react';
import QRCode from 'qrcode.react';
import { useAuthorize, useDepositCryptoAddress } from '@deriv/api';
import { WalletsDepositCryptoAddressLoader } from '../../../../../../components';
import { WalletClipboard, WalletText } from '../../../../../../components/Base';
import useDevice from '../../../../../../hooks/useDevice';
import './DepositCryptoAddress.scss';

const DepositCryptoAddress = () => {
    const { data: depositCryptoAddress, isLoading, mutate } = useDepositCryptoAddress();
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { isMobile } = useDevice();

    useEffect(() => {
        if (isAuthorizeSuccess) {
            mutate();
        }
    }, [isAuthorizeSuccess, mutate]);

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
