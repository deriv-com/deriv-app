import React from 'react';
import { ExpansionPanel } from '../../../../../../components';
import type { THooks } from '../../../../../../hooks/types';
import { PaymentAgentCardDescription } from '../../../../components';
import { PaymentAgentDepositCardDetails } from './components';
import styles from './PaymentAgentDepositCard.module.scss';

type TProps = {
    paymentAgent: THooks.PaymentAgentList[number];
};

const PaymentAgentDepositCard: React.FC<TProps> = ({ paymentAgent }) => {
    return (
        <div className={styles.container} data-testid='dt_payment_agent_deposit_card'>
            <ExpansionPanel
                content={<PaymentAgentDepositCardDetails paymentAgent={paymentAgent} />}
                header={<PaymentAgentCardDescription paymentAgent={paymentAgent} />}
            />
        </div>
    );
};

export default PaymentAgentDepositCard;
