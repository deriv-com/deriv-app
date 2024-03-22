import React from 'react';
import { ExpansionPanel } from '../../../../components';
import type { THooks } from '../../../../hooks/types';
import { PaymentAgentCardDescription, PaymentAgentCardDetails } from './components';
import styles from './PaymentAgentCard.module.scss';

type TProps = {
    isDeposit?: boolean;
    paymentAgent: THooks.PaymentAgentList[number];
};

const PaymentAgentCard: React.FC<TProps> = ({ isDeposit, paymentAgent }) => {
    return (
        <div className={styles.container} data-testid='dt_payment_agent_deposit_card'>
            <ExpansionPanel
                content={isDeposit ? <PaymentAgentCardDetails paymentAgent={paymentAgent} /> : <></>}
                header={<PaymentAgentCardDescription paymentAgent={paymentAgent} />}
            />
        </div>
    );
};

export default PaymentAgentCard;
