import React, { useEffect } from 'react';
import QRCode from 'qrcode.react';
import { useAuthorize, useDepositCryptoAddress } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import { Loader } from '../Loader';
import WalletClipboard from '../WalletClipboard/WalletClipboard';
import './WalletDepositCryptoAddress.scss';

const WalletDepositCryptoAddress = () => {
    const { data: deposit_crypto_address, isLoading, mutate } = useDepositCryptoAddress();
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { is_mobile } = useDevice();

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
            <QRCode value={deposit_crypto_address || ''} size={is_mobile ? 128 : 160} className='' />
            <div className='wallets-deposit-crypto-address__hash-container'>
                <p className='wallets-deposit-crypto-address__hash'>{deposit_crypto_address}</p>
                <WalletClipboard
                    text_copy={deposit_crypto_address || ''}
                    info_message={is_mobile ? undefined : 'copy'}
                    success_message='copied'
                    popoverAlignment={is_mobile ? 'left' : 'bottom'}
                />
            </div>
        </div>
    );
};

export default WalletDepositCryptoAddress;
