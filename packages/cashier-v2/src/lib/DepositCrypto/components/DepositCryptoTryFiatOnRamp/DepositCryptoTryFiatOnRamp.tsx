import React from 'react';
import { useHistory } from 'react-router-dom';
import { Text } from '@deriv-com/ui';
import styles from './DepositCryptoTryFiatOnRamp.module.scss';

const DepositCryptoTryFiatOnRamp = () => {
    const history = useHistory();

    return (
        <div className={styles.container}>
            <Text align='center' size='xs'>
                Looking for a way to buy cryptocurrencies?&nbsp;
                <a className={styles.link} onClick={() => history.push('/cashier-v2/on-ramp')}>
                    Try Fiat onramp
                </a>
                .
            </Text>
        </div>
    );
};

export default DepositCryptoTryFiatOnRamp;
