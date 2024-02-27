import React from 'react';
import { Divider } from '@deriv-com/ui';
import {
    DepositCryptoAddress,
    DepositCryptoCurrencyDetails,
    DepositCryptoDisclaimers,
    DepositCryptoTryFiatOnRamp,
} from './components';
import styles from './DepositCrypto.module.scss';

const DepositCrypto = () => {
    return (
        <div className={styles.container}>
            <div className={styles['main-content']}>
                <DepositCryptoCurrencyDetails />
                <DepositCryptoAddress />
                <DepositCryptoDisclaimers />
                <Divider color='#F2F3F4' height={2} />
                <DepositCryptoTryFiatOnRamp />
            </div>
        </div>
    );
};

export default DepositCrypto;
