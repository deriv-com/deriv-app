import React from 'react';
import { ExpansionPanel } from '../../../../../../components';
import type { THooks } from '../../../../../../hooks/types';
import { PaymentAgentDepositCardDescription } from '../../../../components';
import { PaymentAgentDepositCardDetails } from './components';
import styles from './PaymentAgentDepositCard.module.scss';

type TProps = {
    paymentAgent: THooks.PaymentAgentList[number];
};

const PaymentAgentDepositCard: React.FC<TProps> = ({ paymentAgent }) => {
    return (
        <div className={styles.container}>
            <ExpansionPanel
                content={<PaymentAgentDepositCardDetails paymentAgent={paymentAgent} />}
                header={<PaymentAgentDepositCardDescription paymentAgent={paymentAgent} />}
            />
        </div>
    );
};

export default PaymentAgentDepositCard;
