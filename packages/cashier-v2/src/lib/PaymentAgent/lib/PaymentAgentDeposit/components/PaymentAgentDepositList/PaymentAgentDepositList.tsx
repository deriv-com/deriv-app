import React from 'react';
import { Loader } from '@deriv-com/ui';
import { PaymentAgentSearchWarning } from '../../../../components';
import { usePaymentAgentContext } from '../../../../provider';
import { PaymentAgentDepositCard } from '../PaymentAgentDepositCard';
import styles from './PaymentAgentDepositList.module.scss';

const PaymentAgentDepositList = () => {
    const { isSearchLoading, paymentAgentList } = usePaymentAgentContext();

    if (isSearchLoading) return <Loader />;

    return (
        <div className={styles.container}>
            {paymentAgentList?.length ? (
                paymentAgentList?.map(paymentAgent => {
                    return <PaymentAgentDepositCard key={paymentAgent.name} paymentAgent={paymentAgent} />;
                })
            ) : (
                <PaymentAgentSearchWarning />
            )}
        </div>
    );
};

export default PaymentAgentDepositList;
