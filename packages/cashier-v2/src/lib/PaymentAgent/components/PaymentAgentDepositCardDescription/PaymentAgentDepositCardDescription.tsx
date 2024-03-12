import React from 'react';
import { CardDescription } from '../../../../components';
import { capitalizeFirstLetter } from '../../../../utils';
import { paymentMethodIcons } from '../../lib/PaymentAgentDeposit/constants/icons';
import styles from './PaymentAgentDepositCardDescription.module.scss';

const PaymentAgentDepositCardDescription = ({ paymentAgent }) => {
    return (
        <div className={styles.container}>
            <CardDescription
                description={capitalizeFirstLetter(paymentAgent.further_information).replace(
                    /( ?Skril?l,? ?)|( ?Net?tel?ler,? ?)/gi,
                    ''
                )}
                icons={paymentMethodIcons.light}
                title={paymentAgent.name}
                urls={paymentAgent.urls}
            />
        </div>
    );
};

export default PaymentAgentDepositCardDescription;
