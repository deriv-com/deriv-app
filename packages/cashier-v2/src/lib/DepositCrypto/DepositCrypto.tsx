import React from 'react';
import { Divider } from '@deriv-com/ui';
import DepositCryptoAddress from './components/DepositCryptoAddress/DepositCryptoAddress';
import DepositCryptoCurrencyDetails from './components/DepositCryptoCurrencyDetails/DepositCryptoCurrencyDetails';
import DepositCryptoDisclaimers from './components/DepositCryptoDisclaimers/DepositCryptoDisclaimers';
import DepositCryptoTryFiatOnRamp from './components/DepositCryptoTryFiatOnRamp/DepositCryptoTryFiatOnRamp';
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
