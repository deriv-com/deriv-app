import React, { useEffect } from 'react';
import QRCode from 'qrcode.react';
import { useAuthorize, useDepositCryptoAddress } from '@deriv/api-v2';
import { Text, useDevice } from '@deriv-com/ui';
import { Clipboard } from '../../../../components';
import { DepositCryptoAddressLoader } from '../DepositCryptoAddressLoader';
import styles from './DepositCryptoAddress.module.scss';

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
            <div className={styles.loader} data-testid='dt_deposit-crypto-address-loader'>
                <DepositCryptoAddressLoader />
            </div>
        );

    return (
        <div className={styles.container}>
            <QRCode data-testid='dt_deposit-crypto-address-qr-code' size={128} value={depositCryptoAddress ?? ''} />
            <div className={styles.hash}>
                <div className={styles['hash-text']}>
                    <Text size='sm' weight='bold'>
                        {depositCryptoAddress}
                    </Text>
                </div>
                <div className={styles['hash-clipboard']}>
                    <Clipboard popoverAlignment={isMobile ? 'bottom' : 'right'} textCopy={depositCryptoAddress ?? ''} />
                </div>
            </div>
        </div>
    );
};

export default DepositCryptoAddress;
