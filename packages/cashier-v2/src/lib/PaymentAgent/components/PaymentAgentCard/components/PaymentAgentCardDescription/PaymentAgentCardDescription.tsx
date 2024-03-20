import React from 'react';
import { Link } from 'react-router-dom';
import type { IconTypes } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import type { THooks } from '../../../../../../hooks/types';
import { capitalizeFirstLetter } from '../../../../../../utils';
import { paymentMethodIcons } from '../../../../constants';
import styles from './PaymentAgentCardDescription.module.scss';

type TProps = {
    paymentAgent: THooks.PaymentAgentList[number];
};

const PaymentAgentCardDescription: React.FC<TProps> = ({ paymentAgent }) => {
    const {
        further_information: furtherInformation,
        name,
        supported_payment_methods: supportedPaymentMethods,
        urls,
    } = paymentAgent;

    const theme: 'dark' | 'light' = 'light';

    const icons = supportedPaymentMethods.reduce((acc, { payment_method: paymentMethod }) => {
        if (!paymentMethod || !paymentMethodIcons[paymentMethod]) return acc;
        if (!acc.has(paymentMethodIcons[paymentMethod][theme])) {
            acc.add(paymentMethodIcons[paymentMethod][theme]);
        }
        return acc;
    }, new Set<{ icon: IconTypes; key: string }>());

    return (
        <div className={styles.container}>
            <div className={styles['info-container']}>
                <Text as='p' size='sm' weight='bold'>
                    {name}
                </Text>
                {furtherInformation && (
                    <Text as='p' size='sm'>
                        {capitalizeFirstLetter(furtherInformation).replace(/( ?Skril?l,? ?)|( ?Net?tel?ler,? ?)/gi, '')}
                    </Text>
                )}
                {urls.length > 0 && (
                    <div className={styles['urls-container']}>
                        {urls.map(({ url }, idx, array) => {
                            return (
                                <Text color='red' key={url} size='xs' weight='bold'>
                                    <Link className={styles.url} rel='noopener noreferrer' target='_blank' to={url}>
                                        {url}
                                        {idx === array.length - 1 ? '' : ', '}
                                    </Link>
                                </Text>
                            );
                        })}
                    </div>
                )}
            </div>
            {[...icons].length > 0 && (
                <div className={styles['icons-container']}>
                    {[...icons].map(({ icon: Icon, key }) => (
                        <Icon data-testid='dt_payment_method_icon' height={32} key={key} width={50} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentAgentCardDescription;
