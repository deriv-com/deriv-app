import React from 'react';
import { Text } from '@deriv-com/ui';
import { PaymentAgentMethodsDropdown, PaymentAgentSearchBox } from '../../components';
import { PaymentAgentProvider } from '../../provider';
import { PaymentAgentDepositList } from './components';
import styles from './PaymentAgentDeposit.module.scss';

const PaymentAgentDeposit = () => {
    return (
        <PaymentAgentProvider>
            <div className={styles.container}>
                <Text size='sm'>
                    Contact your preferred payment agent for payment instructions and make your deposit.
                </Text>
                <div className={styles['search-container']}>
                    <PaymentAgentSearchBox />
                    <PaymentAgentMethodsDropdown />
                </div>
                <PaymentAgentDepositList />
            </div>
        </PaymentAgentProvider>
    );
};

export default PaymentAgentDeposit;
