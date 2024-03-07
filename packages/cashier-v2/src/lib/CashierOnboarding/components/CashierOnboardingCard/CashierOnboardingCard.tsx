import React from 'react';
import { LabelPairedChevronRightMdBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import styles from './CashierOnboardingCard.module.scss';

type TProps = {
    description: string;
    onClick?: VoidFunction;
    title: string;
};

const CashierOnboardingCard: React.FC<React.PropsWithChildren<TProps>> = ({
    children,
    description,
    onClick,
    title,
}) => {
    return (
        <div>
            <Text color='prominent' size='lg' weight='bold'>
                {title}
            </Text>
            <button className={styles.container} data-testid='dt_cashier_onboarding_card' onClick={onClick}>
                <div className={styles.content}>
                    <Text className={styles.description} size='sm'>
                        {description}
                    </Text>
                    <LabelPairedChevronRightMdBoldIcon />
                </div>
                {children}
            </button>
        </div>
    );
};

export default CashierOnboardingCard;
