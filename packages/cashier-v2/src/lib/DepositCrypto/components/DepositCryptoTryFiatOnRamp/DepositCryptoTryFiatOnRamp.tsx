import React from 'react';
import { Link } from 'react-router-dom';
import { Text } from '@deriv-com/ui';
import styles from './DepositCryptoTryFiatOnRamp.module.scss';

const DepositCryptoTryFiatOnRamp = () => {
    return (
        <div className={styles.container}>
            <Text align='center' size='xs'>
                Looking for a way to buy cryptocurrencies?&nbsp;
                <Link className={styles.link} to='/cashier-v2/on-ramp'>
                    {' '}
                    Try Fiat onramp{' '}
                </Link>{' '}
                .
            </Text>
        </div>
    );
};

export default DepositCryptoTryFiatOnRamp;
