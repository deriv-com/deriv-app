import React from 'react';
import { InlineMessage, Text } from '@deriv-com/ui';
import styles from './WithdrawalCryptoDisclaimer.module.scss';

const WithdrawalDisclaimer = () => (
    <div className={styles.container}>
        <InlineMessage>
            <ul className={styles.list}>
                <Text as='li'>
                    Do not enter an address linked to an initial coin offering (ICO) purchase or crowdsale. If you do,
                    the initial coin offering (ICO) tokens will not be credited into your account.
                </Text>
                <Text as='li'>
                    Please note that your maximum and minimum withdrawal limits aren’t fixed. They change due to the
                    high volatility of cryptocurrency.
                </Text>
            </ul>
        </InlineMessage>
    </div>
);

export default WithdrawalDisclaimer;
