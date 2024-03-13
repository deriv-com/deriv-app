import React from 'react';
import type { IconTypes } from '@deriv/quill-icons';
import { CardDescription } from '../../../../components';
import type { THooks } from '../../../../hooks/types';
import { capitalizeFirstLetter } from '../../../../utils';
import { paymentMethodIcons } from '../../constants';
import { getNormalizedIconPaymentMethod } from '../../utils';
import styles from './PaymentAgentDepositCardDescription.module.scss';

type TProps = {
    paymentAgent: THooks.PaymentAgentList[number];
};

type TNormalizedIconPaymentMethod = keyof typeof paymentMethodIcons;

const PaymentAgentDepositCardDescription: React.FC<TProps> = ({ paymentAgent }) => {
    const theme: 'dark' | 'light' = 'light';

    const icons = paymentAgent.supported_payment_methods.reduce((acc, { payment_method: paymentMethod }) => {
        if (!paymentMethod) return acc;
        const normalizedIconPaymentMethod = getNormalizedIconPaymentMethod(paymentMethod);
        if (!normalizedIconPaymentMethod) return acc;
        if (!acc.has(paymentMethodIcons[normalizedIconPaymentMethod as TNormalizedIconPaymentMethod][theme])) {
            acc.add(paymentMethodIcons[normalizedIconPaymentMethod as TNormalizedIconPaymentMethod][theme]);
        }
        return acc;
    }, new Set<{ icon: IconTypes; key: string }>());

    return (
        <div className={styles.container}>
            <CardDescription
                description={capitalizeFirstLetter(paymentAgent.further_information).replace(
                    /( ?Skril?l,? ?)|( ?Net?tel?ler,? ?)/gi,
                    ''
                )}
                icons={[...icons]}
                title={paymentAgent.name}
                urls={paymentAgent.urls}
            />
        </div>
    );
};

export default PaymentAgentDepositCardDescription;
