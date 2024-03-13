import React, { useMemo } from 'react';
import { Loader } from '@deriv-com/ui';
import { PaymentAgentSearchWarning } from '../../../../components';
import { usePaymentAgentContext } from '../../../../provider';
import { PaymentAgentDepositCard } from '../PaymentAgentDepositCard';
import styles from './PaymentAgentDepositList.module.scss';

const PaymentAgentDepositList = () => {
    const { isSearchLoading, paymentAgentList } = usePaymentAgentContext();

    const memoizedPaymentAgentList = useMemo(
        () =>
            paymentAgentList?.map(paymentAgent => {
                return <PaymentAgentDepositCard key={paymentAgent.name} paymentAgent={paymentAgent} />;
            }),
        [paymentAgentList]
    );

    if (isSearchLoading) return <Loader />;

    return (
        <div className={styles.container}>
            {paymentAgentList?.length ? memoizedPaymentAgentList : <PaymentAgentSearchWarning />}
        </div>
    );
};

export default PaymentAgentDepositList;
