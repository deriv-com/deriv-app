import React from 'react';
import { ExpansionPanel } from '../../../../../../components';
import { PaymentAgentDepositCardDescription } from '../../../../components';
import { PaymentAgentDepositCardDetails } from './components';
import styles from './PaymentAgentDepositCard.module.scss';

const PaymentAgentDepositCard = ({ paymentAgent }) => {
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
