import React from 'react';
import { Loader, Text } from '@deriv-com/ui';
import { PaymentAgentList, PaymentAgentSearchContainer } from '../components';
import { PaymentAgentProvider, usePaymentAgentContext } from '../provider';
import styles from './PaymentAgentDeposit.module.scss';

const PaymentAgentDeposit = () => {
    const { isPaymentAgentListLoading } = usePaymentAgentContext();

    if (isPaymentAgentListLoading) return <Loader />;

    return (
        <div className={styles.container}>
            <Text size='sm'>Contact your preferred payment agent for payment instructions and make your deposit.</Text>
            <PaymentAgentSearchContainer>
                <PaymentAgentList isDeposit />
            </PaymentAgentSearchContainer>
        </div>
    );
};

const PaymentAgentDepositModule = () => {
    return (
        <PaymentAgentProvider>
            <PaymentAgentDeposit />
        </PaymentAgentProvider>
    );
};

export default PaymentAgentDepositModule;
