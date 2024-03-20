import React, { useMemo } from 'react';
import { Loader } from '@deriv-com/ui';
import { usePaymentAgentContext } from '../../provider';
import { PaymentAgentCard } from '../PaymentAgentCard';
import { PaymentAgentSearchWarning } from '../PaymentAgentSearchWarning';
import styles from './PaymentAgentList.module.scss';

type TProps = {
    isDeposit?: boolean;
};

const PaymentAgentList: React.FC<TProps> = ({ isDeposit }) => {
    const { isSearchLoading, paymentAgentList } = usePaymentAgentContext();

    const memoizedPaymentAgentList = useMemo(
        () =>
            paymentAgentList?.map(paymentAgent => {
                return <PaymentAgentCard isDeposit={isDeposit} key={paymentAgent.name} paymentAgent={paymentAgent} />;
            }),
        [isDeposit, paymentAgentList]
    );

    if (isSearchLoading) return <Loader />;

    return (
        <div className={styles.container}>
            {paymentAgentList?.length ? memoizedPaymentAgentList : <PaymentAgentSearchWarning />}
        </div>
    );
};

export default PaymentAgentList;
