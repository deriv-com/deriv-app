import React, { useEffect } from 'react';
import QRCode from 'qrcode.react';
import { useAuthorize, useDepositCryptoAddress } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import { Loader } from '../Loader';
import WalletClipboard from '../WalletClipboard/WalletClipboard';
import './WalletDepositCryptoAddress.scss';

const WalletDepositCryptoAddress = () => {
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
            <div className='wallets-deposit-crypto-address__loader'>
                <Loader />
            </div>
        );

    return (
        <div className='wallets-deposit-crypto-address'>
            <QRCode size={isMobile ? 128 : 160} value={depositCryptoAddress || ''} />
            <div className='wallets-deposit-crypto-address__hash-container'>
                <p className='wallets-deposit-crypto-address__hash'>{depositCryptoAddress}</p>
                <WalletClipboard
                    infoMessage={isMobile ? undefined : 'copy'}
                    popoverAlignment={isMobile ? 'left' : 'bottom'}
                    successMessage='copied'
                    textCopy={depositCryptoAddress || ''}
                />
            </div>
        </div>
    );
};

export default WalletDepositCryptoAddress;
