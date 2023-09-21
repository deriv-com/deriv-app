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
            <QRCode size={is_mobile ? 128 : 160} value={deposit_crypto_address || ''} />
            <div className='wallets-deposit-crypto-address__hash-container'>
                <p className='wallets-deposit-crypto-address__hash'>{deposit_crypto_address}</p>
                <WalletClipboard
                    info_message={is_mobile ? undefined : 'copy'}
                    popoverAlignment={is_mobile ? 'left' : 'bottom'}
                    success_message='copied'
                    text_copy={deposit_crypto_address || ''}
                />
            </div>
        </div>
    );
};

export default WalletDepositCryptoAddress;
