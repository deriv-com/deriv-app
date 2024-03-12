import React, { Children } from 'react';
import { Text, useDevice } from '@deriv-com/ui';
import styles from './PaymentAgentDepositCardDetail.module.scss';

type TProps = {
    action?: string;
    children: React.ReactNode;
    icon: React.ComponentType<React.SVGAttributes<SVGElement>>;
    title: string;
};

const PaymentAgentDepositCardDetail: React.FC<TProps> = ({ action, children, icon: Icon, title }) => {
    const { isMobile } = useDevice();

    return (
        <div className={styles.container}>
            <div className={styles['icon-wrapper']}>
                <Icon />
            </div>
            <div>
                <Text as='p' size={isMobile ? 'md' : 'sm'}>
                    {title}
                </Text>
                {Children.toArray(children).map((child, id, array) => (
                    <React.Fragment key={id}>
                        {action ? (
                            <Text as='a' href={`${action}:${child}`} size={isMobile ? 'md' : 'sm'} weight='bold'>
                                {child}
                                {id === array.length - 1 ? '' : ', '}
                            </Text>
                        ) : (
                            <Text as='p' size={isMobile ? 'md' : 'sm'} weight='bold'>
                                {child}
                            </Text>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default PaymentAgentDepositCardDetail;
