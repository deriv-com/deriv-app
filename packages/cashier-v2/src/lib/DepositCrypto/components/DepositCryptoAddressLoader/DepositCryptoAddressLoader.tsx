import React from 'react';
import clsx from 'clsx';
import styles from './DepositCryptoAddressLoader.module.scss';

const DepositCryptoAddressLoader = () => {
    return (
        <div className={styles.container}>
            <div className={clsx(styles['qr-code'], styles.skeleton)} />
            <div className={clsx(styles.text, styles.skeleton)} />
        </div>
    );
};

export default DepositCryptoAddressLoader;
